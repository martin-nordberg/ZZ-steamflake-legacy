/**
 * Spec Module: steamflake/core/metamodel/registrySpec
 */

///<reference path='../../../../../ThirdParty/lib/testing/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import registry = require( '../../../../source/steamflake/core/metamodel/registry' );
import sampleElements = require( './sampleElements' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Registry", function() {

    var modelElement1 : sampleElements.ISampleRootContainer;
    var modelElement2 : sampleElements.ISampleContainer;
    var modelElement3 : sampleElements.ISampleElement;
    var elementRegistry : registry.IModelElementRegistry;

    beforeEach( function() {
        modelElement1 = sampleElements.makeSampleRootContainer( uuids.makeUuid() );
        modelElement2 = modelElement1.makeSampleContainer( uuids.makeUuid(), { name: "Two" } );
        modelElement3 = modelElement2.makeSampleElement( uuids.makeUuid(), { name: "Three" } );
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

        it( "Triggers events for element registration and unregistration", function() {
            var registered = false;
            var unregistered = false;

            // responds when an element is registered
            var registrationListener = function( r : registry.IModelElementRegistry, modelElement : elements.IModelElement ) {
                expect( modelElement ).toBe( modelElement1 );
                expect( registered ).toBeFalsy();
                expect( unregistered ).toBeFalsy();
                registered = true;
            }

            // responds when an element is unregistered
            var unregistrationListener = function( r : registry.IModelElementRegistry, modelElement : elements.IModelElement ) {
                expect( modelElement ).toBe( modelElement1 );
                expect( registered ).toBeTruthy();
                expect( unregistered ).toBeFalsy();
                registered = true;
            }

            elementRegistry.elementRegisteredEvent.registerListener( registrationListener );
            elementRegistry.elementUnregisteredEvent.registerListener( unregistrationListener );

            elementRegistry.registerModelElement( modelElement1 );
            elementRegistry.unregisterModelElement( modelElement1 );

            expect( registered ).toBeTruthy();
            expect( unregistered ).toBeFalsy();
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

    describe( "Automatic Child Element Registry", function() {

        beforeEach( function() {
            elementRegistry = registry.makeInMemoryModelElementRegistry();
            registry.addAutomaticChildElementRegistration( elementRegistry );
        } );

        it( "Registers and retrieves elements and their children", function() {
            elementRegistry.registerModelElement( modelElement1 );

            expect( elementRegistry.lookUpModelElementByUuid( modelElement1.uuid ) ).toBe( modelElement1 );
            expect( elementRegistry.lookUpModelElementByUuid( modelElement2.uuid ) ).toBe( modelElement2 );
            expect( elementRegistry.lookUpModelElementByUuid( modelElement3.uuid ) ).toBe( modelElement3 );
        } );

        it( "Unregisters elements and their children correctly", function() {
            elementRegistry.registerModelElement( modelElement1 );
            elementRegistry.unregisterModelElement( modelElement2 );

            expect( elementRegistry.lookUpModelElementByUuid( modelElement1.uuid ) ).toBe( modelElement1 );
            expect( elementRegistry.lookUpModelElementByUuid( modelElement2.uuid ) ).toBeUndefined();
            expect( elementRegistry.lookUpModelElementByUuid( modelElement3.uuid ) ).toBeUndefined();
        } );

    } );

} );