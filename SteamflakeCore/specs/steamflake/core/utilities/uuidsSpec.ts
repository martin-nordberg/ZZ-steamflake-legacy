/**
 * Spec Module: steamflake/core/utilities/uuidsSpec
 */

///<reference path='../../../../../ThirdParty/lib/testing/jasmine.d.ts'/>


import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );



describe( "UUIDs", function() {

    it( "Creates a UUID of appropriate length", function() {
        var uuid = uuids.makeUuid();

        expect( uuid.length ).toBe( 36 );
    } );

    it( "Creates a UUID with correct format", function() {
        var uuid = uuids.makeUuid();

        expect( uuid ).toMatch( /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/ );
    } );

    it( "Passes a valid UUID", function() {
        var uuid = "0123abcd-45ef-467a-89bc-012345defabc";

        expect( uuids.isUuid( uuid ) ).toBeTruthy();
    } );

    it( "Passes an uppercase UUID", function() {
        var uuid = "ABCD0123-EF45-467A-BC89-DEFABC012345";

        expect( uuids.isUuid( uuid ) ).toBeTruthy();
    } );

    it( "Rejects an invalid UUID (1)", function() {
        var uuid = "0123abcd-45ef-467x-89bc-012345defabc";

        expect( uuids.isUuid( uuid ) ).toBeFalsy();
    } );

    it( "Rejects an invalid UUID (2)", function() {
        var uuid = "0123abcd.45ef.467a.89bc.012345defabc";

        expect( uuids.isUuid( uuid ) ).toBeFalsy();
    } );

} );

