/**
 * Spec Module: steamflake/core/metamodel/corecommandsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import commands = require( '../../../../source/steamflake/core/concurrency/commands' );
import corecommands = require( '../../../../source/steamflake/core/metamodel/corecommands' );
import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import registry = require( '../../../../source/steamflake/core/metamodel/registry' );
import sampleElements = require( './sampleElements' );

describe( "Core Commands", function() {

    describe( "Attribute Change Command", function() {
        var command : commands.ICommand<elements.IModelElement>;
        var modelElement : elements.IModelElement;

        beforeEach( function() {
            var rootElement = sampleElements.makeSampleRootContainer( "1000" );
            var containerElement = rootElement.makeSampleContainer( "1001", { name:"Sample", summary:"Sample container for testing" } );
            modelElement = containerElement.makeSampleElement( "1111", { name:"SampleElement", summary:"New summary" } );
            command = corecommands.makeAttributeChangeCommand(
                null,
                modelElement,
                "summary",
                "Old summary" );
        } );

        it( "Constructs successfully", function() {
            expect( command ).not.toBeNull();
            expect( command.title ).toEqual( "Summary Change" );
            expect( command.description ).toEqual( "Change summary from \"Old summary\" to \"New summary\"")
        } );

    } );

    describe( "Element Creation Command", function() {
        var command : commands.ICommand<elements.IModelElement>;
        var elementRegistry : registry.IModelElementRegistry;

        beforeEach( function() {
            elementRegistry = registry.makeNullModelElementRegistry();
            var rootElement = sampleElements.makeSampleRootContainer( "1000" );
            var containerElement = rootElement.makeSampleContainer( "1001", { name:"container", summary:"Sample container for testing" } );
            var childElement = containerElement.makeSampleElement( "1111", { name:"child", summary:"Child summary" } );
            command = corecommands.makeElementCreationCommand(
                null,
                null,
                elementRegistry,
                childElement);
        } );

        it( "Constructs successfully", function() {
            expect( command ).not.toBeNull();
            expect( command.title ).toEqual( "SampleElement Creation" );
            expect( command.description ).toEqual( "Create sampleelement child")
        } );

    } );

    describe( "Element Deletion Command", function() {
        var command : commands.ICommand<elements.IModelElement>;
        var elementRegistry : registry.IModelElementRegistry;

        beforeEach( function() {
            elementRegistry = registry.makeNullModelElementRegistry();
            var rootElement = sampleElements.makeSampleRootContainer( "1000" );
            var containerElement = rootElement.makeSampleContainer( "1001", { name:"container", summary:"Sample container for testing" } );
            var childElement = containerElement.makeSampleElement( "1111", { name:"child", summary:"Child summary" } );
            childElement.destroyed = true;
            command = corecommands.makeElementDeletionCommand(
                null,
                null,
                elementRegistry,
                childElement );
        } );

        it( "Constructs successfully", function() {
            expect( command ).not.toBeNull();
            expect( command.title ).toEqual( "SampleElement Deletion" );
            expect( command.description ).toEqual( "Delete sampleelement child")
        } );

    } );

} );
