/**
 * Spec Module: steamflake/core/metamodel/persistenceSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import persistence = require( '../../../../source/steamflake/core/metamodel/persistence' );
import sampleElements = require( './sampleElements' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Persistence", function() {

    var modelElement : sampleElements.ISampleContainer;
    var store : persistence.IPersistentStore<sampleElements.ISampleRootContainer>;

    beforeEach( function() {
        var rootElement = sampleElements.makeSampleRootContainer( "1000" );
        modelElement = rootElement.makeSampleContainer( "1001", { name:"Sample", summary:"Sample container for testing" } );
    } );

    describe( "Null Persistent Store", function() {

        beforeEach( function() {
            store = persistence.makeNullPersistentStore<sampleElements.ISampleRootContainer>();
        } );

        it( "Does nothing to create", function() {
            expect( function(){
                store.creator.createModelElement( modelElement );
            } ).not.toThrow();
        } );

        it( "Throws an error for reading a root element", function() {
            expect( function(){
                store.reader.loadRootModelElement();
            } ).toThrow();
        } );

        it( "Throws an error for reading element contents", function() {
            expect( function(){
                store.reader.loadModelElementContents( modelElement );
            } ).toThrow();
        } );


        it( "Does nothing to update", function() {
            expect( function(){
                store.updater.updateModelElement( modelElement, { changedAttributeNames: ['none'] } );
            } ).not.toThrow();
        } );

        it( "Does nothing to delete", function() {
            expect( function(){
                store.deleter.deleteModelElement( modelElement );
            } ).not.toThrow();
        } );

    } );

} );