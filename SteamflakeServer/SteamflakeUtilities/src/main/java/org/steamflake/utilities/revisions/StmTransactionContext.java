package org.steamflake.utilities.revisions;

import java.util.Objects;

/**
 * Utility class for managing STM transactions.
 */
public class StmTransactionContext {

    private StmTransactionContext() {
        throw new UnsupportedOperationException( "Static utility class only." );
    }

    /**
     * Creates a new transaction. The lifecycle of the transaction must be managed by the client, which
     * is responsible for calling either commitTransaction or abortTransaction on the result.
     */
    public static StmTransaction beginTransaction() {

        // Force transactions to be one per thread.
        if ( transactionOfCurrentThread.get() != null ) {
            throw new IllegalStateException( "Transaction already in progress for this thread." );
        }

        StmTransaction result = new StmTransaction();

        transactionOfCurrentThread.set( result );

        return result;
    }

    /**
     * Commits the given transaction.
     *
     * @param transaction the in-progress transaction for the current thread.
     */
    public static void commitTransaction( StmTransaction transaction ) {

        if ( transaction != getTransactionOfCurrentThread() ) {
            throw new IllegalStateException( "Attempted to commit transaction not set for the current thread." );
        }

        try {
            // Commit the changes.
            transaction.commit();
        }
        catch ( Throwable e ) {
            // On any error abort the transaction.
            transaction.abort();
            throw e;
        }
        finally {
            // Clear the thread's transaction.
            transactionOfCurrentThread.set( null );
        }

    }

    /**
     * Performs the work of the given callback inside a newly created transaction.
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
                    StmTransaction transaction = new StmTransaction();

                    try {
                        transactionOfCurrentThread.set( transaction );

                        // Execute the transactional task.
                        task.run();

                        // Commit the changes.
                        transaction.commit();

                        // If succeeded, no more retries are needed.
                        return;
                    }
                    catch ( Throwable e ) {
                        // On any error abort the transaction.
                        transaction.abort();
                        throw e;
                    }
                    finally {
                        // Clear the thread's transaction.
                        transactionOfCurrentThread.set( null );
                    }
                }
                catch ( WriteConflictException e ) {
                    // Ignore the exception; go around the loop again....

                    // Increment the thread priority for a better chance on next try.
                    if ( Thread.currentThread().getPriority() < Thread.MAX_PRIORITY ) {
                        Thread.currentThread().setPriority( Thread.currentThread().getPriority() + 1 );
                    }
                }

            }

            // If we dropped out of the loop, then we exceeded the retry count.
            throw new MaximumRetriesExceededException();

        }
        finally {
            // Restore the thread priority after any retries.
            Thread.currentThread().setPriority( Thread.NORM_PRIORITY );
        }

    }

    /**
     * @return the transaction that has been established for the currently running thread
     */
    static StmTransaction getTransactionOfCurrentThread() {

        // Get the thread-local transaction.
        StmTransaction result = transactionOfCurrentThread.get();

        // If there is none, then it's a programming error.
        if ( result == null ) {
            throw new IllegalStateException( "Attempted to complete a transactional operation without a transaction." );
        }

        return result;

    }

    /**
     * Thread-local storage for the transaction in use by the current thread (can be only one per thread).
     */
    private static ThreadLocal<StmTransaction> transactionOfCurrentThread = new ThreadLocal<>();


}
