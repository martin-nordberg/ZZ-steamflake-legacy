/**
 * Spec Module: steamflake/core/metamodel/core/elementsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );


describe( "Model Elements", function() {
    var modelElement : elements.IModelElement;
    var summary = "Summary of test element";
    var typeName = "TestElement";
    var uuid = "UUID";

    beforeEach( function() {
        elements_impl.initialize();

        modelElement = new elements_impl.ModelElement( null, typeName, uuid, summary );
    } );

    it( "Constructs with expected attributes", function() {
        expect( modelElement.summary ).toEqual( summary );
        expect( modelElement.typeName ).toEqual( typeName );
        expect( modelElement.uuid ).toEqual( uuid );
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
        var json = modelElement.toJson( elements.JsonDetailLevel.FullTree );

        expect( json ).toEqual( { type : 'TestElement', uuid : 'UUID', summary : 'Summary of test element' } );
    } );


} );