
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

/**
 * Checks whether a string is a valid UUID.
 * @param uuid The string to check.
 */
export function isUuid( uuid : string ) {
    var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return pattern.test( uuid );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

