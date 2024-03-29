package org.steamflake.utilities.revisions;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Handle to a versioned item that is a list of items.
 */
public class VList<T>
    extends AbstractVersionedItem {

    /**
     * Constructs a new versioned list with given starting value for the current transaction's revision.
     */
    public VList() {

        // Track everything through the current transaction.
        StmTransaction currentTransaction = StmTransactionContext.getTransactionOfCurrentThread();

        this.latestRevision = new AtomicReference<>( null );
        this.latestRevision.set( new Revision<>( currentTransaction.getTargetRevisionNumber(), this.latestRevision.get() ) );

        // keep track of everything we've written
        currentTransaction.addVersionedItemWritten( this );

    }

    /**
     * Adds an item to the list.
     *
     * @param value The new raw value to become the next revision of this item.
     */
    public void add( T value ) {

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
                revision.addedValues.add( value );
                return;
            }

            // if revision is committed and older or equal to our source revision, need a new one
            if ( revisionNumber <= sourceRevisionNumber && revisionNumber > 0 ) {
                break;
            }

        }

        // create the new revision at the front of the chain
        final Revision<T> revision = new Revision<>( currentTransaction.getTargetRevisionNumber(), this.latestRevision.get() );
        revision.addedValues.add( value );
        this.latestRevision.set( revision );

        // keep track of everything we've written
        currentTransaction.addVersionedItemWritten( this );

    }

    /**
     * Reads the version of the item list relevant for the transaction active in the currently running thread.
     *
     * @return a copy of the list of items as of the start of the transaction or else as written by the transaction.
     */
    public List<T> get() {

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
                return revision.getList();
            }

            // If written and committed by some other transaction, note that our transaction is already poised for
            // a write conflict if it writes anything. I.e. fail early for a write conflict.
            if ( revisionNumber > sourceRevisionNumber ) {
                currentTransaction.setNewerRevisionSeen();
            }

            // If revision is committed and older or equal to our source revision, read it.
            if ( revisionNumber <= sourceRevisionNumber && revisionNumber > 0 ) {
                // Keep track of everything we've read.
                currentTransaction.addVersionedItemRead( this );

                // Return the value found for the source revision or earlier.
                return revision.getList();
            }

        }

        assert false : "No revision found for transaction.";

        return null;
    }

    /**
     * Removes an item from the list.
     *
     * @param value The item to be removed from this revision of the list.
     */
    public void remove( T value ) {

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
                revision.removedValues.add( value );
                return;
            }

            // if revision is committed and older or equal to our source revision, need a new one
            if ( revisionNumber <= sourceRevisionNumber && revisionNumber > 0 ) {
                break;
            }

        }

        // create the new revision at the front of the chain
        final Revision<T> revision = new Revision<>( currentTransaction.getTargetRevisionNumber(), this.latestRevision.get() );
        revision.removedValues.add( value );
        this.latestRevision.set( revision );

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
                // If found & removed w/o concurrent change, then done.
                if ( revision.priorRevision.compareAndSet( priorRevision, priorRevision.priorRevision.get() ) ) {
                    return;
                }

                // If concurrent change, abandon this call and try again from the top.
                priorRevision = null;
                this.removeAbortedRevision();
            }
            else {
                // Advance through the list.
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

            // Consolidate revisions older than the oldest usable revision.
            if ( revisionNumber == oldestUsableRevisionNumber ) {
                Revision<T> priorRev = revision.priorRevision.get();
                if ( priorRev != null ) {
                    Revision<T> consolidatedPriorRev = new Revision<>( priorRev.revisionNumber, null );
                    consolidatedPriorRev.addedValues.addAll( priorRev.getList() );
                    revision.priorRevision.set( consolidatedPriorRev );
                }
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

        Revision( AtomicLong revisionNumber, Revision<T> priorRevision ) {
            this.priorRevision = new AtomicReference<>( priorRevision );
            this.revisionNumber = revisionNumber;
            this.addedValues = new ArrayList<>();
            this.removedValues = new ArrayList<>();
        }

        /**
         * Recursively determines the list of items from its history of additions and removals.
         *
         * @return the cumulative list.
         */
        List<T> getList() {
            Revision<T> priorRev = this.priorRevision.get();

            List<T> result;
            if ( priorRev != null ) {
                result = priorRev.getList();
            }
            else {
                result = new ArrayList<>();
            }

            result.addAll( this.addedValues );
            result.removeAll( this.removedValues );

            return result;
        }

        /**
         * The items added to the list during this revision.
         */
        List<T> addedValues;

        /**
         * A reference to the previous revision of the versioned item.
         */
        final AtomicReference<Revision<T>> priorRevision;

        /**
         * The items removed from the list during this revision.
         */
        List<T> removedValues;

        /**
         * The revision number of this revision (uniquely from the transaction that wrote it).
         */
        final AtomicLong revisionNumber;

    }

    /**
     * Reference to the latest revision. Revisions are kept in a custom linked list with the newest revision at
     * the head of the list.
     */
    private final AtomicReference<Revision<T>> latestRevision;

}
