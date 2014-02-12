
/**
 * Module: steamflake/core/concurrency/timing
 */

import platform = require( '../platform/platform' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Executes a callback the next time the event loop is idle.
 * @param task The callback task to execute.
 */
export function doWhenIdle( task : () => void ) {
    platform.doWhenIdle( task );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

