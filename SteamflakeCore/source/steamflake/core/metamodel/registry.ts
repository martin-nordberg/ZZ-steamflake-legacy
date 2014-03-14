
/**
 * Module: steamflake/core/metamodel/registry
 */

import elements = require( './elements' );
import events = require( '../utilities/events' );

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

  ////

    /** Event triggered after an element has been registered. */
    elementRegisteredEvent : events.IStatefulEvent<IModelElementRegistry,elements.IModelElement>;

    /** Event triggered after an element has been unregistered. */
    elementUnregisteredEvent : events.IStatefulEvent<IModelElementRegistry,elements.IModelElement>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class AbstractModelElementRegistry
    /*implements IModelElementRegistry*/
{

    constructor() {
        this._elementRegisteredEvent = events.makeStatefulEvent( this );
        this._elementUnregisteredEvent = events.makeStatefulEvent( this );
    }


    /** Event triggered after an element has been registered. */
    public get elementRegisteredEvent() {
        return this._elementRegisteredEvent;
    }
    public set elementRegisteredEvent( value : events.IStatefulEvent<IModelElementRegistry,elements.IModelElement> ) {
        throw new Error( "Attempted to change read only event - elementRegisteredEvent." );
    }

    /** Event triggered after an element has been unregistered. */
    public get elementUnregisteredEvent() {
        return this._elementUnregisteredEvent;
    }
    public set elementUnregisteredEvent( value : events.IStatefulEvent<IModelElementRegistry,elements.IModelElement> ) {
        throw new Error( "Attempted to change read only event - elementUnregisteredEvent." );
    }

  ////

    /** Event triggered after an element has been registered. */
    private _elementRegisteredEvent : events.IStatefulEvent<IModelElementRegistry,elements.IModelElement>;

    /** Event triggered after an element has been unregistered. */
    private _elementUnregisteredEvent : events.IStatefulEvent<IModelElementRegistry,elements.IModelElement>;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A no-op registry of model elements.
 */
class NullModelElementRegistry
    extends AbstractModelElementRegistry
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
        // do nothing except trigger event
        this.elementRegisteredEvent.trigger( modelElement );
    }

    /**
     * Removes a model element from this registry.
     * @param modelElement The model element to remove.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        // do nothing except trigger event
        this.elementUnregisteredEvent.trigger( modelElement );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A model element registry that tracks model elements by UUID broken into two pieces.
 */
class InMemoryModelElementRegistry
    extends AbstractModelElementRegistry
    implements IModelElementRegistry
{

    /**
     * Constructs a model element registry.
     */
    constructor() {
        super();
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
        if ( typeof subregistry === 'undefined' ) {
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
        if ( typeof subregistry === 'undefined' ) {
            subregistry = {};
            this._registry[ uuidSegments[0] ] = subregistry;
        }

        if ( typeof subregistry[ uuidSegments[1] ] === 'undefined' ) {
            subregistry[ uuidSegments[1] ] = modelElement;
            this.elementRegisteredEvent.trigger( modelElement );
        }

    }

    /**
     * Removes a model element from this registry.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {

        var uuid = modelElement.uuid;
        var uuidSegments = this.splitUuid( uuid );

        var subregistry = this._registry[ uuidSegments[0] ];
        if ( typeof subregistry !== 'undefined' ) {

            if ( subregistry[ uuidSegments[1] ] === modelElement ) {
                delete subregistry[ uuidSegments[1] ];
                this.elementUnregisteredEvent.trigger( modelElement );
            }
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
class ChildRegisteringModelElementRegistryListener {

    /**
     * Constructs a listener for a given registry.
     */
    constructor(
        modelElementRegistry : IModelElementRegistry
    ) {

        // responds when an element is registered
        var registrationListener = function( registry : IModelElementRegistry, modelElement : elements.IModelElement ) {
            if ( modelElement.isContainer ) {
                var container = <elements.IContainerElement>modelElement;

                container.childElements.forEach( function( childElement : elements.IModelElement ) {
                    modelElementRegistry.registerModelElement( childElement );
                } );
            }
        }

        // responds when an element is unregistered
        var unregistrationListener = function( registry : IModelElementRegistry, modelElement : elements.IModelElement ) {
            if ( modelElement.isContainer ) {
                var container = <elements.IContainerElement>modelElement;

                container.childElements.forEach( function( childElement : elements.IModelElement ) {
                    modelElementRegistry.unregisterModelElement( childElement );
                } );
            }
        }

        modelElementRegistry.elementRegisteredEvent.registerListener( registrationListener );
        modelElementRegistry.elementUnregisteredEvent.registerListener( unregistrationListener );

    }

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
 * Adds event listening to the given registry such that child elements are automatically registered and unregistered
 * when a container is registered or unregistered.
 * @param modelElementRegistry The inner registry to be configured with automatic child registration.
 */
export function addAutomaticChildElementRegistration( modelElementRegistry : IModelElementRegistry ) {
    new ChildRegisteringModelElementRegistryListener( modelElementRegistry );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
