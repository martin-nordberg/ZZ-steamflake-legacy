/**
 * Spec Module: steamflake/core/metamodel/core/registrySpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import registry = require( '../../../../source/steamflake/core/metamodel/registry' );
import registry_impl = require( '../../../../source/steamflake/core/metamodel/registry_impl' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Registry", function() {

    var modelElement1 : elements.IModelElement;
    var modelElement2 : elements.IModelElement;
    var modelElement3 : elements.IModelElement;
    var elementRegistry : registry.IModelElementRegistry;

    beforeEach( function() {
        registry_impl.initialize();

        modelElement1 = new elements_impl.ModelElement( null, "One", uuids.makeUuid(), "Sample element one" );
        modelElement2 = new elements_impl.ModelElement( null, "Two", uuids.makeUuid(), "Sample element two" );
        modelElement3 = new elements_impl.ModelElement( null, "Three", uuids.makeUuid(), "Sample element three" );
    } );

    describe( "Null Model Element Registry", function() {

        beforeEach( function() {
            elementRegistry = registry.makeNullModelElementRegistry();
        } );

        it( "Registers but does not retrieve elements", function() {
            elementRegistry.registerModelElement( modelElement1 );

            expect( function(){
                elementRegistry.lookUpModelElementByUuid( modelElement1.uuid );
            } ).toThrow();
        } );

    } );

    describe( "In-Memory Model Element Registry", function() {

        beforeEach( function() {
            elementRegistry = registry.makeInMemoryModelElementRegistry();
        } );

        it( "Registers and retrieves elements", function() {
            elementRegistry.registerModelElement( modelElement1 );
            elementRegistry.registerModelElement( modelElement2 );
            elementRegistry.registerModelElement( modelElement3 );

            expect( elementRegistry.lookUpModelElementByUuid( modelElement1.uuid ) ).toBe( modelElement1 );
            expect( elementRegistry.lookUpModelElementByUuid( modelElement2.uuid ) ).toBe( modelElement2 );
            expect( elementRegistry.lookUpModelElementByUuid( modelElement3.uuid ) ).toBe( modelElement3 );
        } );

        it( "Unregisters elements correctly", function() {
            elementRegistry.registerModelElement( modelElement1 );
            elementRegistry.registerModelElement( modelElement2 );
            elementRegistry.registerModelElement( modelElement3 );
            elementRegistry.unregisterModelElement( modelElement2 );

            expect( elementRegistry.lookUpModelElementByUuid( modelElement1.uuid ) ).toBe( modelElement1 );
            expect( elementRegistry.lookUpModelElementByUuid( modelElement2.uuid ) ).toBeUndefined();
            expect( elementRegistry.lookUpModelElementByUuid( modelElement3.uuid ) ).toBe( modelElement3 );
        } );

    } );

} );