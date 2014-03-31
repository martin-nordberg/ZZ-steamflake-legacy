/**
 * Spec Module: steamflake/core/metamodel/elementsSpec
 */

///<reference path='../../../../../ThirdParty/lib/testing/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import sampleElements = require( './sampleElements' );


describe( "Model Elements", function() {
    var containerElement : sampleElements.ISampleContainer;
    var modelElement : elements.INamedElement;
    var name = "example";
    var summary = "Summary of test element";
    var uuid = "UUID";

    beforeEach( function() {
        var rootElement = sampleElements.makeSampleRootContainer( "1000" );
        containerElement = rootElement.makeSampleContainer( "1001", { name:"Sample", summary:"Sample container for testing" } );
        modelElement = containerElement.makeSampleElement( uuid, { name:name, summary:summary } );
    } );

    it( "Constructs with expected attributes", function() {
        expect( modelElement.isContainer ).toBeFalsy();
        expect( modelElement.name ).toEqual( name );
        expect( modelElement.summary ).toEqual( summary );
        expect( modelElement.typeName ).toEqual( "SampleElement" );
        expect( modelElement.uuid ).toEqual( uuid );
    } );

    it( "Triggers an event for name attribute change", function() {
        var newName = "exemplar";
        var changed = false;

        function listener( eventSource : elements.IModelElement, data:{ attributeName:string; oldValue:string; newValue:string } ) {
            expect( eventSource ).toBe( modelElement );
            expect( data.attributeName ).toEqual( "name" );
            expect( data.oldValue ).toEqual( name );
            expect( data.newValue ).toEqual( newName );
            changed = true;
        }

        modelElement.attributeChangeEvent.registerListener( listener );

        modelElement.name = newName;

        modelElement.attributeChangeEvent.unregisterListener( listener );

        expect( changed ).toBeTruthy();
    } );

    it( "Triggers an event for summary attribute change", function() {
        var newSummary = "Revised summary of test element";
        var changed = false;

        function listener( eventSource : elements.IModelElement, data:{ attributeName:string; oldValue:string; newValue:string } ) {
            expect( eventSource ).toBe( modelElement );
            expect( data.attributeName ).toEqual( "summary" );
            expect( data.oldValue ).toEqual( summary );
            expect( data.newValue ).toEqual( newSummary );
            changed = true;
        }

        modelElement.attributeChangeEvent.registerListener( listener );

        modelElement.summary = newSummary;

        modelElement.attributeChangeEvent.unregisterListener( listener );

        expect( changed ).toBeTruthy();
    } );

    it( "Writes to JSON", function() {
        var json = modelElement.toJson( elements.EJsonDetailLevel.FullTree );

        expect( json ).toEqual( { type : 'SampleElement', uuid : 'UUID', name : 'example', summary : 'Summary of test element' } );
    } );

    it( "Saves and retrieves extended attributes", function() {
        modelElement.setExtendedAttribute( "spec.a", "AAA" );

        expect( modelElement.getExtendedAttribute( "spec.a" ) ).toEqual( "AAA" );
    } );

    it( "Retrieves extended attribute defaults", function() {
        expect( modelElement.getExtendedAttribute( "spec.a", "AAA" ) ).toEqual( "AAA" );
        expect( modelElement.getExtendedAttribute( "spec.a" ) ).toEqual( "AAA" );
    } );

    it( "Triggers an event for child creation", function() {
        var listenCount = 0;

        function listener1( container : elements.IContainerElement, child : elements.IModelElement ) {
            expect( listenCount ).toEqual( 0 );
            expect( container ).toEqual( containerElement );
            expect( child.uuid ).toEqual( "12345" );
            expect( ( <sampleElements.ISampleElement> child ).name ).toEqual( "test" );
            expect( child.summary ).toEqual( "test" );
            listenCount = 1;
        }

        containerElement.childElementAddedEvent.registerListener( listener1 );

        containerElement.makeSampleElement( "12345", { name:"test", summary:"test" } );

        expect( listenCount ).toEqual( 1 );
    } );

    it( "Triggers events for element destruction", function() {
        var listenCount = 0;

        function listener1( container : elements.IContainerElement, child : elements.IModelElement ) {
            expect( listenCount ).toEqual( 0 );
            expect( container ).toEqual( containerElement );
            expect( child ).toEqual( modelElement );
            expect( child.destroyed ).toBeTruthy();
            listenCount = 1;
        }

        function listener2( child : elements.IModelElement ) {
            expect( listenCount ).toEqual( 1 );
            expect( child ).toEqual( modelElement );
            expect( child.destroyed ).toBeTruthy();
            listenCount = 2;
        }

        containerElement.childElementRemovedEvent.registerListener( listener1 );
        modelElement.elementDestroyedEvent.registerListener( listener2 );

        modelElement.destroyed = true;

        expect( listenCount ).toEqual( 2 );
    } );

} );