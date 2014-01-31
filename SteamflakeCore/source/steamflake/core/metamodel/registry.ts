
/**
 * Module: steamflake/core/metamodel/registry
 */

import elements = require( './elements' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a registry of model elements.
 */
export interface IModelElementRegistry {

    /**
     * Finds the model element with given UUID.
     * @param uuid The unique ID of the model element to find.
     * @returns the model element found or null if not registered.
     */
    lookUpModelElementByUuid( uuid : string ) : elements.IModelElement;

    /**
     * Adds a model element to this registry.
     * @param swModelElement The model element to be added.
     */
    registerModelElement( swModelElement : elements.IModelElement ) : void;

    /**
     * Removes a model element from this registry.
     * @param swModelElement The model element to remove.
     */
    unregisterModelElement( swModelElement : elements.IModelElement ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new do-nothing model element registry.
 * @returns a new no-op model element registry
 */
export var makeNullModelElementRegistry : () => IModelElementRegistry;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new model element registry.
 * @returns a new model element registry
 */
export var makeInMemoryModelElementRegistry : () => IModelElementRegistry;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new model element registry wrapper that automatically registers the child elements of every model
 * element registered.
 * @param modelElementRegistry The inner registry to be wrapped with child registration
 * @returns a new model element registry wrapping the given one
 */
export var makeChildRegisteringModelElementRegistry : ( modelElementRegistry : IModelElementRegistry ) => IModelElementRegistry;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

