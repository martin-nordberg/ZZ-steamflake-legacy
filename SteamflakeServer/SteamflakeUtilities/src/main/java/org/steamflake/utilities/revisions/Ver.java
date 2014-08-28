package org.steamflake.utilities.revisions;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

/**
 * A version-managing handle to a value with transactional revisions.
 *
 * @param <T> the type of the value that is managed through its revisions.
 */
public class Ver<T>
    extends AbstractVersionedItem {

    /**
     * Constructs a new versioned handle with given starting value for the current transaction's revision.
     *
     * @param value the initial value.
     */
    public Ver( T value ) {

        // Sanity check the input.
        Objects.requireNonNull( value );

        // Track everything through the current transaction.
        StmTransaction currentTransaction = StmTransactionContext.getTransactionOfCurrentThread();

        this.latestRevision = new AtomicReference<>( null );
        this.latestRevision.set( new Revision<>( value, currentTransaction.getTargetRevisionNumber(), this.latestRevision.get() ) );

        // keep track of everything we've written
        currentTransaction.addVersionedItemWritten( this );

    }

    /**
     * Reads the version of the item relevant for the transaction active in the currently running thread.
     *
     * @return the value as of the start of the transaction or else as written by the transaction
     */
    public T get() {

        // Track everything through the current transaction.
        StmTransaction currentTransaction = StmTransactionContext.getTransactionOfCurrentThread();

        // Work within the transaction of the current thread.
        long sourceRevisionNumber = currentTransaction.getSourceRevisionNumber();
        long targetRevisionNumber = currentTransaction.getTargetRevisionNumber().get();

        // Loop through the revisions.
        for ( Revision<T> revision = this.latestRevision.get(); revision != null; revision = revision.priorRevision.get() ) {

            final long revisionNumber = revision.revisionNumber.get();

            // If written by the current transaction, read back the written value.
            if ( revisionNumber == targetRevisionNumber ) {
                return revision.value;
            }

            // If written and committed by some other transaction, note that our transaction is already poised for
            // a write conflict if it writes anything. I.e. fail early for a write conflict.
            if ( revisionNumber > sourceRevisionNumber ) {
                currentTransaction.setNewerRevisionSeen();
            }

            // Rf revision is committed and older or equal to our source revision, read it.
            if ( revisionNumber <= sourceRevisionNumber && revisionNumber > 0 ) {
                // Keep track of everything we've read.
                currentTransaction.addVersionedItemRead( this );

                // Return the value found for the source revision or earlier.
                return revision.value;
            }

        }

        assert false : "No revision found for transaction.";

        return null;
    }

    /**
     * Writes a new revision of the item managed by this handle.
     *
     * @param value The new raw value to become the next revision of this item.
     */
    public void set( T value ) {

        // Sanity check the input
        Objects.requireNonNull( value );

        // Work within the transaction of the current thread.
        StmTransaction currentTransaction = StmTransactionContext.getTransactionOfCurrentThread();

        long sourceRevisionNumber = currentTransaction.getSourceRevisionNumber();
        long targetRevisionNumber = currentTransaction.getTargetRevisionNumber().get();

        // loop through the revisions
        for ( Revision<T> revision = this.latestRevision.get(); revision != null; revision = revision.priorRevision.get() ) {

            final long revisionNumber = revision.revisionNumber.get();

            // if previously written by the current transaction, just update to the newer value
            if ( revisionNumber == targetRevisionNumber ) {
                revision.value = value;
                return;
            }

            // if revision is committed and older or equal to our source revision, need a new one
            if ( revisionNumber <= sourceRevisionNumber && revisionNumber > 0 ) {
                break;
            }

        }

        // create the new revision at the front of the chain
        this.latestRevision.set( new Revision<>( value, currentTransaction.getTargetRevisionNumber(), this.latestRevision.get() ) );

        // keep track of everything we've written
        currentTransaction.addVersionedItemWritten( this );

    }

    @Override
    void ensureNotWrittenByOtherTransaction() {

        // Work within the transaction of the current thread.
        StmTransaction currentTransaction = StmTransactionContext.getTransactionOfCurrentThread();

        long sourceRevisionNumber = currentTransaction.getSourceRevisionNumber();

        // loop through the revisions
        for ( Revision<T> revision = this.latestRevision.get(); revision != null; revision = revision.priorRevision.get() ) {

            final long revisionNumber = revision.revisionNumber.get();

            // if find something newer, then transaction conflicts
            if ( revisionNumber > sourceRevisionNumber ) {
                throw new WriteConflictException();
            }

            // if revision is committed and older or equal to our source revision, then done
            if ( revisionNumber <= sourceRevisionNumber && revisionNumber > 0 ) {
                break;
            }

        }

    }

    @Override
    void removeAbortedRevision() {

        // First check the latest revision.
        Revision<T> revision = this.latestRevision.get();

        while ( revision.revisionNumber.get() == 0L ) {
            if ( this.latestRevision.compareAndSet( revision, revision.priorRevision.get() ) ) {
                return;
            }
        }

        // Loop through the revisions.
        Revision<T> priorRevision = revision.priorRevision.get();
        while ( priorRevision != null ) {

            final long revisionNumber = priorRevision.revisionNumber.get();

            if ( revisionNumber == 0L ) {
                if ( revision.priorRevision.compareAndSet( priorRevision, priorRevision.priorRevision.get() ) ) {
                    return;
                }
                priorRevision = null;
                this.removeAbortedRevision();
            }
            else {
                revision = priorRevision;
                priorRevision = revision.priorRevision.get();
            }
        }

    }

    @Override
    void removeUnusedRevisions( long oldestUsableRevisionNumber ) {

        // Loop through the revisions.
        for ( Revision<T> revision = this.latestRevision.get(); revision != null; revision = revision.priorRevision.get() ) {

            final long revisionNumber = revision.revisionNumber.get();

            // Truncate revisions older than the oldest usable revision.
            if ( revisionNumber == oldestUsableRevisionNumber ) {
                revision.priorRevision.set( null );
                break;
            }

        }

    }

    /**
     * Internal record structure for revisions in the linked list of revisions.
     *
     * @param <T> the type of the value that is managed through its revisions.
     */
    private static class Revision<T> {

        Revision( T value, AtomicLong revisionNumber, Revision<T> priorRevision ) {
            this.priorRevision = new AtomicReference<>( priorRevision );
            this.revisionNumber = revisionNumber;
            this.value = value;
        }

        /**
         * A reference to the previous revision of the versioned item.
         */
        final AtomicReference<Revision<T>> priorRevision;

        /**
         * The revision number of this revision (uniquely from the transaction that wrote it).
         */
        final AtomicLong revisionNumber;

        /**
         * The value of the versioned item at this revision.
         */
        T value;

    }

    /**
     * Reference to the latest revision. Revisions are kept in a custom linked list with the newest revision at
     * the head of the list.
     */
    private final AtomicReference<Revision<T>> latestRevision;

}
