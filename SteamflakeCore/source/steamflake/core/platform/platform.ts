
/**
 * Module: steamflake/core/platform/platform
 */

import platform_browser = require( './platform_browser' );
import platform_node = require( './platform_node' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Executes a task during the next idle point of the event loop.
 * @param task The callback task to execute.
 */
export function doWhenIdle( task : () => void ) : void {
    // properly defined in platform_node or platform_browser
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
