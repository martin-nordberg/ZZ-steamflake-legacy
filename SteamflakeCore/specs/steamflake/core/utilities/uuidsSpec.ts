/**
 * Spec Module: steamflake/core/utilities/uuidsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );



describe( "UUIDs", function() {

    it( "Creates a UUID of appropriate length", function() {
        var uuid = uuids.makeUuid();

        expect( uuid.length ).toBe( 36 );
    } );

    it( "Creates a UUID with correct format", function() {
        var uuid = uuids.makeUuid();

        expect( uuid ).toMatch( /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/ );
    })

} );

