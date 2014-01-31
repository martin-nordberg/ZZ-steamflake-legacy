
/**
 * Module: steamflake/core/metamodel/registry_impl
 */

import elements = require( './elements' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A no-op registry of model elements.
 */
class NullModelElementRegistry
    implements registry.IModelElementRegistry {

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
    public registerModelElement( swModelElement : elements.IModelElement ) : void {
        // do nothing
    }

    /**
     * Removes a model element from this registry.
     * @param swModelElement The model element to remove.
     */
    public unregisterModelElement( swModelElement : elements.IModelElement ) : void {
        // do nothing
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A model element registry that tracks model elements by UUID broken into two pieces.
 */
class InMemoryModelElementRegistry
    implements registry.IModelElementRegistry
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
    public registerModelElement( swModelElement : elements.IModelElement ) : void {
        var uuid = swModelElement.uuid;
        var uuidSegments = this.splitUuid( uuid );
        var subregistry = this._registry[ uuidSegments[0] ];
        if ( subregistry === undefined ) {
            subregistry = {};
            this._registry[ uuidSegments[0] ] = subregistry;
        }
        subregistry[ uuidSegments[1] ] = swModelElement;
    }

    /**
     * Removes a model element from this registry.
     */
    public unregisterModelElement( swModelElement : elements.IModelElement ) : void {
        var uuid = swModelElement.uuid;
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
    implements registry.IModelElementRegistry
{

    /**
     * Constructs a registry from an inner registry and an updater.
     */
    constructor(
        modelElementRegistry : registry.IModelElementRegistry
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
    public registerModelElement( swModelElement : elements.IModelElement ) : void {
        var self = this;

        self._modelElementRegistry.registerModelElement( swModelElement );

        if ( swModelElement.isContainer() ) {
            var swContainer = <elements.IContainerElement>swModelElement;

            swContainer.childElements.forEach( function( swChildElement : elements.IModelElement ) {
                self.registerModelElement( swChildElement );
            } );
        }
    }

    /**
     * Removes a model element from this registry.
     */
    public unregisterModelElement( swModelElement : elements.IModelElement ) : void {
        this._modelElementRegistry.unregisterModelElement( swModelElement );
    }

    private _modelElementRegistry : registry.IModelElementRegistry;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Sets up the wiring for constructor functions in the registry module.
 */
export function initialize() : void {

    if ( typeof registry.makeNullModelElementRegistry === 'undefined' ) {
        registry.makeNullModelElementRegistry = function() : registry.IModelElementRegistry {
            return new NullModelElementRegistry();
        };
    }

    if ( typeof registry.makeInMemoryModelElementRegistry === 'undefined' ) {
        registry.makeInMemoryModelElementRegistry = function() : registry.IModelElementRegistry {
            return new InMemoryModelElementRegistry();
        };
    }

    if ( typeof registry.makeChildRegisteringModelElementRegistry === 'undefined' ) {
        registry.makeChildRegisteringModelElementRegistry = function( modelElementRegistry : registry.IModelElementRegistry ) : registry.IModelElementRegistry {
            return new ChildRegisteringModelElementRegistry( modelElementRegistry );
        }
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

