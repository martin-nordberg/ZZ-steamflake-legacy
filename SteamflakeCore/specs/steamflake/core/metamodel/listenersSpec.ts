/**
 * Spec Module: steamflake/core/metamodel/registrySpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import commands = require( '../../../../source/steamflake/core/concurrency/commands' );
import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import listeners = require( '../../../../source/steamflake/core/metamodel/listeners' );
import persistence = require( '../../../../source/steamflake/core/metamodel/persistence' );
import promises = require( '../../../../source/steamflake/core/concurrency/promises' );
import registry = require( '../../../../source/steamflake/core/metamodel/registry' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Listeners", function() {

    var modelElement1 : elements.IModelElement;
    var modelElement2 : elements.IModelElement;
    var modelElement3 : elements.IModelElement;
    var elementRegistry : registry.IModelElementRegistry;

    var updater /*: persistence.IPersistentStoreUpdater*/ = {
        updateModelElement : function<Element extends elements.IModelElement>(
            modelElement : Element,
            options : persistence.IPersistentStoreUpdaterOptions
        ) : promises.IPromise<Element> {
            var uuid = modelElement.uuid;
            this.updateCounts[uuid] = ( this.updateCounts[uuid] || 0 ) + 1;
            return promises.makeImmediatelyFulfilledPromise( modelElement );
        },
        updateCounts: {}
    };

    beforeEach( function() {
        modelElement1 = new elements_impl.ModelElement( null, "One", uuids.makeUuid(), "Sample element one" );
        modelElement2 = new elements_impl.ModelElement( null, "Two", uuids.makeUuid(), "Sample element two" );
        modelElement3 = new elements_impl.ModelElement( null, "Three", uuids.makeUuid(), "Sample element three" );

        var cmdHistory = commands.makeNullCommandHistory();

        elementRegistry = registry.makeInMemoryModelElementRegistry();
        elementRegistry = listeners.makeUpdateListeningCodeElementRegistry( elementRegistry, undefined, updater, undefined, cmdHistory );
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

    it( "Listens for updates", function() {
        elementRegistry.registerModelElement( modelElement1 );
        elementRegistry.registerModelElement( modelElement2 );
        elementRegistry.registerModelElement( modelElement3 );

        modelElement1.summary = "Revised element one";
        modelElement2.summary = "Revised element two";
        modelElement2.summary = "Doubly revised element one";

        expect( updater.updateCounts[modelElement1.uuid] ).toBe( 1 );
        expect( updater.updateCounts[modelElement2.uuid] ).toBe( 2 );
        expect( updater.updateCounts[modelElement3.uuid] ).toBeUndefined();
    } );

} );