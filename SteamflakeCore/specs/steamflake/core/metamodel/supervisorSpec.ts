/**
 * Spec Module: steamflake/core/metamodel/supervisorSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import persistence = require( '../../../../source/steamflake/core/metamodel/persistence' );
import supervisor = require( '../../../../source/steamflake/core/metamodel/supervisor' );


describe( "Supervisor", function() {

    it( "Constructs", function() {

        var p = persistence.makeNullPersistentStore();
        var s = supervisor.makeMetamodelSupervisor( p );

        expect( s ).not.toBeNull();

    } );

} );


