
/**
 * Module: steamflake/core/metamodel/listeners_impl
 */

import elements = require( './elements' );
import listeners = require( './listeners' );
import persistence = require( './persistence' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Service that listens for changes in Steamflake model elements and passes them on to commands that update a
 * persistence layer.
 */
class UpdateListener
    implements listeners.IUpdateListener
{

    /**
     * Constructs a new update listener.
     */
    constructor(
        updater : persistence.IPersistentStoreUpdater
    ) {
        this._updater = updater;
    }

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    public listenForChanges(
        modelElement : elements.IModelElement
    ) : void {
        // TBD: use element's schema to listen to its attributes
    }

    private _updater : persistence.IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A model element registry that also registers model elements with a persistent store updater to track changes.
 */
class UpdateListeningModelElementRegistry
    implements registry.IModelElementRegistry
{

    /**
     * Constructs a registry from an inner registry and an updater.
     */
    constructor(
        modelElementRegistry : registry.IModelElementRegistry,
        updateListener : listeners.IUpdateListener
    ) {
        this._modelElementRegistry = modelElementRegistry;
        this._updateListener = updateListener;
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
     * Adds a model element to this registry. Also adds the model element to the updater.
     */
    public registerModelElement( modelElement : elements.IModelElement ) : void {
        this._modelElementRegistry.registerModelElement( modelElement );
        modelElement.acceptVisitor( this._updateListener, 'listenForChangesIn' );
        console.log( "Model element registered; listening for model element changes: ", modelElement.uuid );
    }

    /**
     * Removes a model element from this registry.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        // TBD: stop listening for updates ...
        this._modelElementRegistry.unregisterModelElement( modelElement );
    }

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _updateListener : listeners.IUpdateListener;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

