
/**
 * Module: steamflake/core/metamodel/corecommands
 */

import commands = require( '../utilities/commands' );
import elements = require( './elements' );
import persistence = require( './persistence' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new instance of this command to act upon the given code element.
 */
export var makeAttributeChangeCommand : <Element extends elements.IModelElement,T>(
    updater : persistence.IPersistentStoreUpdater,
    modelElement : Element,
    attributeTitle : string,
    attributeName : string,
    newValue : T
) => commands.ICommand<T>;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new instance of this command to create a package with given attributes.
 */
export var makeElementCreationCommand : <ParentElement extends elements.IContainerElement>(
    creator : persistence.IPersistentStoreCreator,
    deleter : persistence.IPersistentStoreDeleter,
    modelElementRegistry: registry.IModelElementRegistry,
    maker: any,
    parentComponent : ParentElement,
    childTypeName : string,
    attributes : any
) => commands.ICommand<elements.IModelElement>;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

