/**
 * Spec Module: steamflake/model/structureSpec
 */

///<reference path='../../../../SteamflakeCore/specs/thirdparty/jasmine/jasmine.d.ts'/>


import structure = require( '../../../source/steamflake/model/structure' );
import uuids = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/uuids' );


describe( "Structure", function() {

    describe( "Root Package", function()  {
        var rootPackage : structure.IRootPackage;

        beforeEach( function() {
            rootPackage = structure.makeRootPackage( uuids.makeUuid() );
        } );

        it( "Constructs a root package", function() {
            expect( rootPackage ).toBeDefined();
        } );

    } );

} );