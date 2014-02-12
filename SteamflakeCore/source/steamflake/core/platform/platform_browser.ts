
/**
 * Module: steamflake/core/platform/platform_browser
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Executes a task during the next idle point of the event loop.
 * @param task The callback task to execute.
 */
export function doWhenIdle( task : () => void ) : void {
    // TBD: use setImmediate when available
    // TBD: consider Barnes&Noble setImmediate shim
    setTimeout( task, 0 );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
