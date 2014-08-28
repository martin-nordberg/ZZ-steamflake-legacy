package org.steamflake.utilities.revisions;

import java.util.HashSet;
import java.util.Objects;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Utility class for managing in-memory transactions. The code is similar to "versioned boxes", the concept
 * behind JVSTM for software transactional memory. However, this code is much more streamlined, though very
 * experimental.
 */
public class StmTransaction {

    /**
     * Constructs a new transaction.
     */
    StmTransaction() {

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

        // Establish a link for putting this transaction in a linked list of completed transactions.
        this.nextTransactionAwaitingCleanUp = new AtomicReference<>( null );

    }

    /**
     * Atomically commits the given transaction.
     *
     * @param transaction the transaction to commit
     * @throws WriteConflictException if some other transaction has written some value the given transaction read
     */
    private static synchronized void writeTransaction( StmTransaction transaction ) {

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
    void abort() {

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
     * Tracks all versioned items read by this transaction. The transaction will confirm that all these items remain
     * unwritten by some other transaction before this transaction commits.
     *
     * @param versionedItem the item that has been read.
     */
    void addVersionedItemRead( AbstractVersionedItem versionedItem ) {

        // Sanity check the input.
        Objects.requireNonNull( versionedItem );

        // Track versioned items read by this transaction.
        this.versionedItemsRead.add( versionedItem );

    }

    /**
     * Tracks all versioned items written by this transaction. The versions written by this transaction will be cleaned
     * up after the transaction aborts. Any earlier versions will be cleaned up after all transactions using any
     * earlier versions and their source have completed.
     *
     * @param versionedItem the item that has been written.
     */
    void addVersionedItemWritten( AbstractVersionedItem versionedItem ) {

        // Sanity check the input.
        Objects.requireNonNull( versionedItem );

        // Track all versioned items written by this transaction.
        this.versionedItemsWritten.add( versionedItem );

        // If we have already seen a write conflict, fail early.
        if ( this.newerRevisionSeen ) {
            throw new WriteConflictException();
        }

    }

    /**
     * Commits this transaction.
     *
     * @throws WriteConflictException if some other transaction has concurrently written values read during this
     *                                transaction.
     */
    void commit() {

        // Make the synchronized changed to make the transaction permanent.
        if ( this.versionedItemsWritten.size() > 0 ) {
            writeTransaction( this );
        }

        // No longer hang on to the items read.
        this.versionedItemsRead.clear();

        // Add this transaction (with its written revisions) to a queue awaiting clean up when no longer needed.
        this.awaitCleanUp();

        // Trigger any clean up that is possible from no longer needing our source version.
        this.cleanUpOlderRevisions();

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
     * Puts this transaction at the head of a list of all transactions awaiting clean up.
     */
    private void awaitCleanUp() {

        // Get the first transaction awaiting clean up.
        StmTransaction firstTransAwaitingCleanUp = firstTransactionAwaitingCleanUp.get();

        // Link this transaction into the head of the list.
        this.nextTransactionAwaitingCleanUp.set( firstTransAwaitingCleanUp );

        // Spin until we do both atomically.
        while ( !firstTransactionAwaitingCleanUp.compareAndSet( firstTransAwaitingCleanUp, this ) ) {
            firstTransAwaitingCleanUp = firstTransactionAwaitingCleanUp.get();
            this.nextTransactionAwaitingCleanUp.set( firstTransAwaitingCleanUp );
        }

    }

    /**
     * Removes the source revision number of this transaction from those in use. Cleans up older revisions
     * if not in use by other transactions.
     */
    private void cleanUpOlderRevisions() {

        // We're no longer using the source revision.
        final long priorOldestRevisionInUse = sourceRevisionsInUse.peek();
        sourceRevisionsInUse.remove( this.sourceRevisionNumber );

        // Determine the oldest revision still needed.
        Long oldestRevisionInUse = sourceRevisionsInUse.peek();
        if ( oldestRevisionInUse == null ) {
            oldestRevisionInUse = priorOldestRevisionInUse;
        }

        //  Remove each transaction awaiting clean up that has a target revision number older than needed.
        AtomicReference<StmTransaction> tref = firstTransactionAwaitingCleanUp;
        StmTransaction t = tref.get();
        if ( t == null ) {
            return;
        }

        AtomicReference<StmTransaction> trefNext = t.nextTransactionAwaitingCleanUp;
        StmTransaction tNext = trefNext.get();

        while ( true ) {
            if ( t.targetRevisionNumber.get() <= oldestRevisionInUse ) {
                if ( tref.compareAndSet( t, tNext ) ) {
                    // Remove revisions older than the now unused revision number.
                    t.removeUnusedRevisions();
                    t.nextTransactionAwaitingCleanUp.set( null );
                }
            }
            else {
                tref = trefNext;
            }

            // Advance through the list of transactions awaiting clean up.
            t = tref.get();
            if ( t == null ) {
                return;
            }
            trefNext = t.nextTransactionAwaitingCleanUp;
            tNext = trefNext.get();
        }

    }

    /**
     * Cleans up of all the referenced versioned items written by this transaction.
     */
    private void removeUnusedRevisions() {

        // Remove all revisions older than the one written by this transaction.
        for ( AbstractVersionedItem versionedItem : this.versionedItemsWritten ) {
            versionedItem.removeUnusedRevisions( this.targetRevisionNumber.get() );
        }

        // Stop referencing the versioned items.
        this.versionedItemsWritten.clear();

    }

    /**
     * Head of a linked list of transactions awaiting clean up.
     */
    private static AtomicReference<StmTransaction> firstTransactionAwaitingCleanUp = new AtomicReference<>( null );

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
     * A revision number seen during reading that will cause a write conflict if anything writes through this transaction.
     */
    private boolean newerRevisionSeen;

    /**
     * The next transaction in a linked list of transactions awaiting clean up.
     */
    private final AtomicReference<StmTransaction> nextTransactionAwaitingCleanUp;

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
