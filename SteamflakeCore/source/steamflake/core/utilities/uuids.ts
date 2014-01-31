
/**
 * Module: steamflake/core/utilties/uuids
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new random UUID. TBD: much better algorithms out there.
 */
export function makeUuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0;
        var v = ( c == 'x' ) ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

