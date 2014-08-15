/**
 * Spec Module: steamflake/model/structureSpec
 */

///<reference path='../../../../SteamflakeCore/specs/../../ThirdParty/lib/testing/jasmine.d.ts'/>


import structure = require( '../../../source/steamflake/model/structure' );
import uuids = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/uuids' );


describe( "Structure", function() {

    describe( "Root Namespace", function()  {
        var rootNamespace : structure.IRootNamespace;

        beforeEach( function() {
            rootNamespace = structure.makeRootNamespace( uuids.makeUuid() );
        } );

        it( "Constructs a root namespace", function() {
            expect( rootNamespace ).toBeDefined();
        } );

    } );

} );