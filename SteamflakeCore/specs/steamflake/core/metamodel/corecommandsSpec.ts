/**
 * Spec Module: steamflake/core/metamodel/corecommandsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import commands = require( '../../../../source/steamflake/core/utilities/commands' );
import corecommands = require( '../../../../source/steamflake/core/metamodel/corecommands' );
import corecommands_impl = require( '../../../../source/steamflake/core/metamodel/corecommands_impl' );
import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import registry = require( '../../../../source/steamflake/core/metamodel/registry' );
import registry_impl = require( '../../../../source/steamflake/core/metamodel/registry_impl' );

describe( "Core Commands", function() {

    beforeEach( function() {
        elements_impl.initialize();
        corecommands_impl.initialize();
        registry_impl.initialize();
    } )

    describe( "Attribute Change Command", function() {
        var command : commands.ICommand<string>;
        var modelElement : elements.IModelElement;

        beforeEach( function() {
            modelElement = new elements_impl.ModelElement( null, "SampleElement", "12345", "Old summary" );
            command = corecommands.makeAttributeChangeCommand(
                null,
                modelElement,
                "Summary",
                "summary",
                "A new summary" );
        } );

        it( "Constructs successfully", function() {
            expect( command ).not.toBeNull();
        } );

    } );

    describe( "Element Creation Command", function() {
        var command : commands.ICommand<elements.IModelElement>;
        var modelElement : elements.IContainerElement;
        var elementRegistry : registry.IModelElementRegistry;

        beforeEach( function() {
            elementRegistry = registry.makeNullModelElementRegistry();
            modelElement = new elements_impl.NamedContainerElement( null, "SampleElement", "12345", "MyName", "Old summary" );
            command = corecommands.makeElementCreationCommand(
                null,
                null,
                elementRegistry,
                {},
                modelElement,
                "SampleElement",
                {});
        } );

        it( "Constructs successfully", function() {
            expect( command ).not.toBeNull();
        } );

    } );

} );
