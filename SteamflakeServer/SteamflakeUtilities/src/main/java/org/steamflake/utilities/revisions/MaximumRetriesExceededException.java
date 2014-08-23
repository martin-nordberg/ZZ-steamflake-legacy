package org.steamflake.utilities.revisions;

/**
 * Exception thrown when a transaction fails within its specified number of retries..
 */
public class MaximumRetriesExceededException
    extends Exception {

    /**
     * Constructs a new exception.
     */
    public MaximumRetriesExceededException() {
        super( "Maximum retries exceeded." );
    }

}
