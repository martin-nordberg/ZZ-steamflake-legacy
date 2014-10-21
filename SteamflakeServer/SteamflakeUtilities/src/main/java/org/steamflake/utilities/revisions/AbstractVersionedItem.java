package org.steamflake.utilities.revisions;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interface to a versioned value that supports clean up of obsolete or aborted versions.
 * <p>
 * TODO: make versioned items observable:
 * void subscribe( boolean insideTransaction, Subscriber subscriber );
 * void unsubscribe( Subscriber subscriber );
 */
abstract class AbstractVersionedItem {

    /**
     * Constructs a new abstract versioned item with unique identity.
     */
    protected AbstractVersionedItem() {
        this.hashCode = lastHashCode.incrementAndGet();
    }

    @SuppressWarnings("SimplifiableIfStatement")
    @Override
    public final boolean equals( Object that ) {

        if ( this == that ) {
            return true;
        }

        if ( that == null || getClass() != that.getClass() ) {
            return false;
        }

        return hashCode == ((AbstractVersionedItem) that).hashCode;

    }

    @Override
    public final int hashCode() {
        return hashCode;
    }

    /**
     * Ensures that this item has been written by no transaction other than the currently running one.
     *
     * @throws WriteConflictException if there has been another transaction writing this item.
     */
    abstract void ensureNotWrittenByOtherTransaction();

    /**
     * Removes an aborted revision from this versioned item.
     */
    abstract void removeAbortedRevision();

    /**
     * Removes any revisions older than the given one
     *
     * @param oldestUsableRevisionNumber the oldest revision number that can still be of any use.
     */
    abstract void removeUnusedRevisions( long oldestUsableRevisionNumber );

    /**
     * The last used hash code.
     */
    private static AtomicInteger lastHashCode = new AtomicInteger( 0 );

    /**
     * The sequential hash code of this versioned item.
     */
    private final int hashCode;

}
