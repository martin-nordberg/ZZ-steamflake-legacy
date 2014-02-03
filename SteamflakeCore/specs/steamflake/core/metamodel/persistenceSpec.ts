/**
 * Spec Module: steamflake/core/metamodel/core/registrySpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import persistence = require( '../../../../source/steamflake/core/metamodel/persistence' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Persistence", function() {

    var modelElement : elements.IContainerElement;
    var store : persistence.IPersistentStore;

    beforeEach( function() {
        modelElement = new elements_impl.NamedContainerElement( null, "Sample", uuids.makeUuid(), "container", "Sample element" );
    } );

    describe( "Null Persistent Store", function() {

        beforeEach( function() {
            store = persistence.makeNullPersistentStore();
        } );

        it( "Does nothing to create", function() {
            expect( function(){
                store.creator.createModelElement( modelElement, { succeed:function(element:elements.IModelElement){} } );
            } ).not.toThrow();
        } );

        it( "Throws an error for reading a root element", function() {
            expect( function(){
                store.reader.loadRootModelElement( { succeed:function(element:elements.IRootContainerElement){} })
            } ).toThrow();
        } );

        it( "Throws an error for reading element contents", function() {
            expect( function(){
                store.reader.loadModelElementContents( modelElement, { succeed:function(element:elements.IContainerElement){} })
            } ).toThrow();
        } );


        it( "Does nothing to update", function() {
            expect( function(){
                store.updater.updateModelElement( modelElement, { changedAttributeNames: ['none'] } );
            } ).not.toThrow();
        } );

        it( "Does nothing to delete", function() {
            expect( function(){
                store.deleter.deleteModelElement( modelElement, {} );
            } ).not.toThrow();
        } );

    } );

} );