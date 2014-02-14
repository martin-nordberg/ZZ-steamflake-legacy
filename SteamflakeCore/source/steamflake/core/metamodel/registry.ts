
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
     * @param modelElement The model element to be added.
     */
    registerModelElement( modelElement : elements.IModelElement ) : void;

    /**
     * Removes a model element from this registry.
     * @param modelElement The model element to remove.
     */
    unregisterModelElement( modelElement : elements.IModelElement ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A no-op registry of model elements.
 */
class NullModelElementRegistry
    implements IModelElementRegistry
{

    /**
     * Finds the model element with given UUID.
     * @param uuid The unique ID of the model element to find.
     * @returns the model element found or null if not registered.
     */
    public lookUpModelElementByUuid( uuid : string ) : elements.IModelElement {
        throw new Error( "Unexpectedly tried to look up model element in null registry." );
    }

    /**
     * Adds a model element to this registry.
     */
    public registerModelElement( modelElement : elements.IModelElement ) : void {
        // do nothing
    }

    /**
     * Removes a model element from this registry.
     * @param modelElement The model element to remove.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        // do nothing
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A model element registry that tracks model elements by UUID broken into two pieces.
 */
class InMemoryModelElementRegistry
    implements IModelElementRegistry
{

    /**
     * Constructs a model element registry.
     */
    constructor() {
        this._registry = {};
    }

    /**
     * Finds the model element with given UUID.
     * @param uuid The unique ID of the model element to find.
     * @returns the model element found or null if not registered.
     */
    public lookUpModelElementByUuid( uuid : string ) : elements.IModelElement {
        var uuidSegments = this.splitUuid( uuid );
        var subregistry = this._registry[ uuidSegments[0] ];
        if ( subregistry === undefined ) {
            return undefined;
        }
        return subregistry[ uuidSegments[1] ];
    }

    /**
     * Adds a model element to this registry.
     */
    public registerModelElement( modelElement : elements.IModelElement ) : void {
        var uuid = modelElement.uuid;
        var uuidSegments = this.splitUuid( uuid );
        var subregistry = this._registry[ uuidSegments[0] ];
        if ( subregistry === undefined ) {
            subregistry = {};
            this._registry[ uuidSegments[0] ] = subregistry;
        }
        subregistry[ uuidSegments[1] ] = modelElement;
    }

    /**
     * Removes a model element from this registry.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        var uuid = modelElement.uuid;
        var uuidSegments = this.splitUuid( uuid );
        var subregistry = this._registry[ uuidSegments[0] ];
        if ( subregistry !== undefined ) {
            delete subregistry[ uuidSegments[1] ];
        }
    }

    /**
     * Breaks a UUID into two pieces (at its first dash) for two-level indexing in this registry.
     * @param uuid The UUID to split.
     * @returns An array of two strings from the UUID.
     */
    private splitUuid( uuid : string ) : string[] {
        return [ uuid.substr(0,8), uuid.substr(9) ];
    }

    /** The root of the tree of model elements by UUID. */
    private _registry : Object;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A model element registry that also registers model elements with a persistent store updater to track changes.
 */
class ChildRegisteringModelElementRegistry
    implements IModelElementRegistry
{

    /**
     * Constructs a registry from an inner registry and an updater.
     */
    constructor(
        modelElementRegistry : IModelElementRegistry
    ) {
        this._modelElementRegistry = modelElementRegistry;
    }

    /**
     * Finds the model element with given UUID.
     * @param uuid The unique ID of the model element to find.
     * @returns the model element found or null if not registered.
     */
    public lookUpModelElementByUuid( uuid : string ) : elements.IModelElement {
        return this._modelElementRegistry.lookUpModelElementByUuid( uuid );
    }

    /**
     * Adds a model element to this registry. Also registers the elements children if any.
     */
    public registerModelElement( modelElement : elements.IModelElement ) : void {
        var self = this;

        self._modelElementRegistry.registerModelElement( modelElement );

        if ( modelElement.isContainer ) {
            var container = <elements.IContainerElement>modelElement;

            container.childElements.forEach( function( childElement : elements.IModelElement ) {
                self.registerModelElement( childElement );
            } );
        }
    }

    /**
     * Removes a model element from this registry.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        this._modelElementRegistry.unregisterModelElement( modelElement );
    }

    private _modelElementRegistry : IModelElementRegistry;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new do-nothing model element registry.
 * @returns a new no-op model element registry
 */
export function makeNullModelElementRegistry() : IModelElementRegistry {
    return new NullModelElementRegistry();
}

/**
 * Constructs a new model element registry.
 * @returns a new model element registry
 */
export function makeInMemoryModelElementRegistry() : IModelElementRegistry {
    return new InMemoryModelElementRegistry();
}

/**
 * Constructs a new model element registry wrapper that automatically registers the child elements of every model
 * element registered.
 * @param modelElementRegistry The inner registry to be wrapped with child registration
 * @returns a new model element registry wrapping the given one
 */
export function makeChildRegisteringModelElementRegistry( modelElementRegistry : IModelElementRegistry ) : IModelElementRegistry {
    return new ChildRegisteringModelElementRegistry( modelElementRegistry );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
