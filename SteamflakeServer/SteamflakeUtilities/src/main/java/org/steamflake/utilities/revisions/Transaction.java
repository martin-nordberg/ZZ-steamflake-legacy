package org.steamflake.utilities.revisions;

import javax.annotation.Nonnull;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Utility class for managing in-memory transactions. The code is similar to "versioned boxes", the concept
 * behind JVSTM for software transactional memory. However, this code is much more streamlined, though very
 * experimental.
 */
public class Transaction
    implements Comparable<Transaction> {

    /**
     * Constructs a new transaction.
     */
    private Transaction() {

        // Spin until we get a next rev number and put it in the queue of rev numbers in use w/o concurrent change.
        // (We avoid concurrent change because if another thread bumped the revisions in use, it might also have
        // cleaned up the revision before we said we were using it.)
        while ( true ) {
            long sourceRevNumber = lastCommittedRevisionNumber.get();
            sourceRevisionsInUse.add( sourceRevNumber );
            if ( sourceRevNumber == lastCommittedRevisionNumber.get() ) {
                this.sourceRevisionNumber = sourceRevNumber;
                break;
            }
            sourceRevisionsInUse.remove( sourceRevNumber );
        }

        // Use the next negative pending revision number to mark our writes.
        this.targetRevisionNumber = new AtomicLong( lastPendingRevisionNumber.decrementAndGet() );

        // Track the versioned items read and written by this transaction.
        this.versionedItemsRead = new HashSet<>();
        this.versionedItemsWritten = new HashSet<>();

        // Flag a write conflict as early as possible.
        this.newerRevisionSeen = false;

    }

    /**
     * Performs the work of the given callback inside a transaction.
     *
     * @param task       the work to be done inside a transaction.
     * @param maxRetries the maximum number of times to retry the transaction if write conflicts are encountered
     *                   (must be zero or more, zero meaning try but don't retry).
     * @throws MaximumRetriesExceededException if the transaction fails even after the specified number of retries.
     * @throws Exception                       any exception thrown by the transactional task
     */
    public static void doInTransaction( int maxRetries, Runnable task ) throws Exception {

        // Sanity check the input.
        Objects.requireNonNull( task );
        if ( maxRetries < 0 ) {
            throw new IllegalArgumentException( "Retry count must be greater than or equal to zero." );
        }

        // Force transactions to be one per thread.
        if ( transactionOfCurrentThread.get() != null ) {
            throw new IllegalStateException( "Transaction already in progress for this thread." );
        }

        try {

            for ( int retry = 0; retry <= maxRetries; retry += 1 ) {

                try {
                    Transaction transaction = new Transaction();

                    try {
                        transactionOfCurrentThread.set( transaction );

                        // Execute the transactional task.
                        task.run();

                        // Commit the changes.
                        transaction.commit();

                        // If succeeded, no more retries are needed.
                        return;
                    } catch ( Throwable e ) {
                        // On any error abort the transaction.
                        transaction.abort();
                        throw e;
                    } finally {
                        // Clear the thread's transaction.
                        transactionOfCurrentThread.set( null );
                    }
                } catch ( WriteConflictException e ) {
                    // Ignore the exception; go around the loop again....

                    // Increment the thread priority for a better chance on next try.
                    if ( Thread.currentThread().getPriority() < Thread.MAX_PRIORITY ) {
                        Thread.currentThread().setPriority( Thread.currentThread().getPriority() + 1 );
                    }
                }

            }

            // If we dropped out of the loop, then we exceeded the retry count.
            throw new MaximumRetriesExceededException();

        } finally {
            // Restore the thread priority after any retries.
            Thread.currentThread().setPriority( Thread.NORM_PRIORITY );
        }

    }

    @Override
    public int compareTo( Transaction that ) {
        return Long.compare( this.targetRevisionNumber.get(), that.targetRevisionNumber.get() );
    }

    /**
     * @return the transaction that has been established for the currently running thread
     */
    static
    @Nonnull
    Transaction getTransactionOfCurrentThread() {

        // Get the thread-local transaction.
        Transaction result = transactionOfCurrentThread.get();

        // If there is none, then it's a programming error.
        if ( result == null ) {
            throw new IllegalStateException( "Attempted to complete a transactional operation without a transaction." );
        }

        return result;

    }

    /**
     * Tracks all versioned items read by this transaction. The transaction will confirm that all these items remain
     * unwritten by some other transaction before this transaction commits.
     *
     * @param versionedItem the item that has been read.
     */
    void addVersionedItemRead( @Nonnull AbstractVersionedItem versionedItem ) {

        this.versionedItemsRead.add( versionedItem );
    }

    /**
     * Tracks all versioned items written by this transaction. The versions written by this transaction will be cleaned
     * up after the transaction aborts. Any earlier versions will be cleaned up after all transactions using any
     * earlier versions and their source have completed.
     *
     * @param versionedItem the item that has been written.
     */
    void addVersionedItemWritten( @Nonnull AbstractVersionedItem versionedItem ) {

        // Track all versioned items written by this transaction.
        this.versionedItemsWritten.add( versionedItem );

        // If we have already seen a write conflict, fail early.
        if ( this.newerRevisionSeen ) {
            throw new WriteConflictException();
        }

    }

    /**
     * @return the revision number of information to be read by this transaction
     */
    long getSourceRevisionNumber() {
        return sourceRevisionNumber;
    }

    /**
     * Determines the status of this transaction from its target revision number.
     * <p>
     * TBD: this seems to have no use
     *
     * @return the transaction status (IN_PROGRESS, COMMITTED, or ABORTED).
     */
    ETransactionStatus getStatus() {
        long targetRevNumber = this.targetRevisionNumber.get();
        if ( targetRevNumber < 0 ) {
            return ETransactionStatus.IN_PROGRESS;
        }
        if ( targetRevNumber == 0 ) {
            return ETransactionStatus.ABORTED;
        }
        return ETransactionStatus.COMMITTED;
    }

    /**
     * @return the revision number of information written by this transaction (negative while transaction is running; positive after committed.
     */
    AtomicLong getTargetRevisionNumber() {
        return this.targetRevisionNumber;
    }

    /**
     * When garbage collected itself, triggers the clean up of all the referenced versioned items. Note that
     * the use of finalize() is generally to be avoided, but we're piggy-backing on the JVM apparatus for
     * cleaning up ordinary memory garbage to also clean up revision garbage. This seems like a worthwhile
     * usage.
     *
     * @throws Throwable only if the super call fails
     */
    @Override
    protected void finalize() throws Throwable {
        try {
            // Remove all revisions older than the one written by this transaction.
            for ( AbstractVersionedItem versionedItem : versionedItemsWritten ) {
                versionedItem.removeUnusedRevisions( this.targetRevisionNumber.get() );
            }
        } finally {
            super.finalize();
        }
    }

    /**
     * Takes note that some read operation has seen a newer version and will certainly fail with a write conflict if
     * this transaction writes anything. Fails immediately if this transaction has already written anything.
     */
    void setNewerRevisionSeen() {

        // If we have previously written something, then we've detected a write conflict; fail early.
        if ( !this.versionedItemsWritten.isEmpty() ) {
            throw new WriteConflictException();
        }

        // Track the newer revision number to fail early if we subsequently write something.
        this.newerRevisionSeen = true;

    }

    /**
     * Atomically commits the given transaction.
     *
     * @param transaction the transaction to commit
     * @throws WriteConflictException if some other transaction has written some value the given transaction read
     */
    private static synchronized void writeTransaction( Transaction transaction ) {

        // Check for conflicts.
        for ( AbstractVersionedItem versionedItem : transaction.versionedItemsRead ) {
            versionedItem.ensureNotWrittenByOtherTransaction();
        }

        // Set the revision number to a committed value.
        transaction.targetRevisionNumber.set( lastCommittedRevisionNumber.incrementAndGet() );

    }

    /**
     * Aborts this transaction; abandons the revisions made by the transaction.
     */
    private void abort() {

        // Revision number = 0 indicates an aborted transaction.
        this.targetRevisionNumber.set( 0L );

        // Clean up aborted revisions ...
        for ( AbstractVersionedItem versionedItem : this.versionedItemsWritten ) {
            versionedItem.removeAbortedRevision();
        }

        this.versionedItemsRead.clear();
        this.versionedItemsWritten.clear();

        // Trigger any clean up that is possible from no longer needing our source version.
        this.cleanUpOlderRevisions();

    }

    /**
     * Removes the source revision number of this transaction from those in use. Cleans up older revisions
     * if not in use by other transactions.
     */
    private void cleanUpOlderRevisions() {

        // We're no longer using the source revision.
        final long priorOldestRevisionInUse = sourceRevisionsInUse.peek();
        sourceRevisionsInUse.remove( this.sourceRevisionNumber );

        // Whenever a source revision has become obsolete, also clean up old revisions as a side effect of ordinary
        // garbage collection. In other words, items removed from the queue below (which are no longer otherwise
        // referenced) will clean up obsolete revisions when they themselves are garbage collected.
        // This is very experimental.
        final Long oldestRevisionInUse = sourceRevisionsInUse.peek();
        if ( oldestRevisionInUse == null ) {
            // The queue was (momentarily at least) empty, so kill everything below the prior oldest version.
            transactionsAwaitingCleanUp.removeIf( t -> t.targetRevisionNumber.get() <= priorOldestRevisionInUse );
        } else if ( oldestRevisionInUse > priorOldestRevisionInUse ) {
            // We were the last transaction needing our source revision, so clean up after ourselves.
            transactionsAwaitingCleanUp.removeIf( t -> t.targetRevisionNumber.get() <= oldestRevisionInUse );
        }

    }

    /**
     * Commits this transaction.
     *
     * @throws WriteConflictException if some other transaction has concurrently written values read during this
     *                                transaction.
     */
    private void commit() {

        // Make the synchronized changed to make the transaction permanent.
        if ( this.versionedItemsWritten.size() > 0 ) {
            writeTransaction( this );
        }

        // No longer hang on to the items read.
        this.versionedItemsRead.clear();

        // Add our revisions to a queue awaiting clean up when no longer needed.
        transactionsAwaitingCleanUp.add( this );

        // Trigger any clean up that is possible from no longer needing our source version.
        this.cleanUpOlderRevisions();

    }

    /**
     * Thread-local storage for the transaction in use by the current thread (can be only one per thread).
     */
    private static ThreadLocal<Transaction> transactionOfCurrentThread = new ThreadLocal<>();

    /**
     * Monotone increasing revision number incremented whenever a transaction is successfully committed.
     */
    private static AtomicLong lastCommittedRevisionNumber = new AtomicLong( 0 );

    /**
     * Monotone decreasing revision number decremented whenever a transaction is started. Negative value
     * indicates a transaction in progress.
     */
    private static AtomicLong lastPendingRevisionNumber = new AtomicLong( 0 );

    /**
     * Priority queue of revision numbers currently in use as the source revision for some transaction.
     */
    private static Queue<Long> sourceRevisionsInUse = new PriorityBlockingQueue<>();

    /**
     * Priority queue of transactions awaiting clean up once the revisions they wrote are no longer in use.
     */
    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    private static Collection<Transaction> transactionsAwaitingCleanUp = new ConcurrentLinkedQueue<>();

    /**
     * A revision number seen during reading that will cause a write conflict if anything writes through this transaction.
     */
    private boolean newerRevisionSeen;

    /**
     * The revision number being read by this transaction.
     */
    private final long sourceRevisionNumber;

    /**
     * The revision number being written by this transaction. Negative while the transaction is running; zero if
     * the transaction is aborted; positive after the transaction has been committed.
     */
    private final AtomicLong targetRevisionNumber;

    /**
     * The versioned items read by this transaction.
     */
    private final Set<AbstractVersionedItem> versionedItemsRead;

    /**
     * The versioned item written by this transaction.
     */
    private final Set<AbstractVersionedItem> versionedItemsWritten;

}
