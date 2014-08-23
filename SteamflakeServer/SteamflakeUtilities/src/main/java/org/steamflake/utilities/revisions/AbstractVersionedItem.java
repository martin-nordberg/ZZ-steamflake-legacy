package org.steamflake.utilities.revisions;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interface to a versioned value that supports clean up of obsolete or aborted versions.
 */
abstract class AbstractVersionedItem {

    /**
     * Constructs a new abstract versioned item with unique identity.
     */
    protected AbstractVersionedItem() {
        this.hashCode = lastHashCode.incrementAndGet();
    }

    /**
     * Ensures that this item has been written by no transaction other than the currently running one.
     *
     * @throws WriteConflictException if there has been another transaction writing this item.
     */
    abstract void ensureNotWrittenByOtherTransaction();

    @Override
    public boolean equals( Object o ) {
        if ( this == o ) return true;
        if ( o == null || getClass() != o.getClass() ) return false;

        AbstractVersionedItem that = (AbstractVersionedItem) o;

        if ( hashCode != that.hashCode ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return hashCode;
    }

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
    private int hashCode;

}
