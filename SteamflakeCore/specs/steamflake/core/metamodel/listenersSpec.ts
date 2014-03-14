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
import sampleElements = require( './sampleElements' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Listeners", function() {

    var modelElement1 : sampleElements.ISampleRootContainer;
    var modelElement2 : sampleElements.ISampleContainer;
    var modelElement3 : sampleElements.ISampleElement;
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
        modelElement1 = sampleElements.makeSampleRootContainer( uuids.makeUuid() );
        modelElement2 = modelElement1.makeSampleContainer( uuids.makeUuid(), { name: "Two" } );
        modelElement3 = modelElement2.makeSampleElement( uuids.makeUuid(), { name: "Three" } );

        var cmdHistory = commands.makeNullCommandHistory();

        elementRegistry = registry.makeInMemoryModelElementRegistry();
        listeners.addAutomaticUpdatePersistence( elementRegistry, undefined, updater, undefined, cmdHistory );
        registry.addAutomaticChildElementRegistration( elementRegistry );
    } );

    it( "Listens for updates", function() {
        elementRegistry.registerModelElement( modelElement1 );

        modelElement1.summary = "Revised element one";
        modelElement2.summary = "Revised element two";
        modelElement2.summary = "Doubly revised element one";

        expect( updater.updateCounts[modelElement1.uuid] ).toBe( 1 );
        expect( updater.updateCounts[modelElement2.uuid] ).toBe( 2 );
        expect( updater.updateCounts[modelElement3.uuid] ).toBeUndefined();
    } );

} );