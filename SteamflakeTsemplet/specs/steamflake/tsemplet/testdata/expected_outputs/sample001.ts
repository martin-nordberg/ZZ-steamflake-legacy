
/** Sample template function constructs an HTML div element with given ID and content. */
export function sample001a( id : string, text : string ) {
    return [
        '<div id="',
        id,
        '">',
        text,
        '</div>'
    ].join();
}
