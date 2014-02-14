
/**
 * Module: steamflake/core/metamodel/listeners
 */

import commands = require( '../concurrency/commands' );
import elements = require( './elements' );
import persistence = require( './persistence' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a service that listens for changes in model elements.
 */
export interface IUpdateListener {

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    listenForChanges(
        modelElement : elements.IModelElement
    ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Service that listens for changes in L-Zero metamodel elements and passes them on to commands that update a
 * persistence layer.
 */
class UpdateListener
    implements IUpdateListener
{

    /**
     * Constructs a new update listener.
     */
    constructor(
        updater : persistence.IPersistentStoreUpdater,
        commandHistory : commands.ICommandHistory
    ) {
        this._commandHistory = commandHistory;
        this._updater = updater;
    }

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    public listenForChanges(
        modelElement : elements.IModelElement
    ) : void {
        modelElement.attributeChangeEvent.registerListener( this.handleAttributeChange.bind( this ) );
    }

    public handleAttributeChange( modelElement : elements.IModelElement, change : {attributeName:string; oldValue : any; newValue : any} ) {
        // TBD
    }

    private _commandHistory : commands.ICommandHistory;

    private _updater : persistence.IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A code element registry that also registers code elements with a persistent store updater to track changes.
 */
export class UpdateListeningCodeElementRegistry
    implements registry.IModelElementRegistry
{

    /**
     * Constructs a registry from an inner registry and an updater.
     */
    constructor(
        modelElementRegistry : registry.IModelElementRegistry,
        updateListener : IUpdateListener
    ) {
        this._modelElementRegistry = modelElementRegistry;
        this._updateListener = updateListener;
    }

    /**
     * Finds the code element with given UUID.
     * @param uuid The unique ID of the code element to find.
     * @returns the code element found or null if not registered.
     */
    public lookUpModelElementByUuid( uuid : string ) : elements.IModelElement {
        return this._modelElementRegistry.lookUpModelElementByUuid( uuid );
    }

    /**
     * Adds a code element to this registry. Also adds the code element to the updater.
     */
    public registerModelElement( modelElement : elements.IModelElement ) : void {
        this._modelElementRegistry.registerModelElement( modelElement );
        this._updateListener.listenForChanges( modelElement );
        console.log( "Code element registered; listening for code element changes: ", modelElement.uuid );
    }

    /**
     * Removes a code element from this registry.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        // TBD: stop listening for updates ...
        this._modelElementRegistry.unregisterModelElement( modelElement );
    }

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _updateListener : IUpdateListener;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new update listener.
 * @param updater The persistent store updater behind the scenes
 * @param commandHistory The command history to keep commands in.
 * @returns {lzero.language.metamodel.listeners.UpdateListener}
 */
export function makeUpdateListener(
    updater : persistence.IPersistentStoreUpdater,
    commandHistory : commands.ICommandHistory = commands.makeNullCommandHistory()
) : IUpdateListener {
    return new UpdateListener( updater, commandHistory );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeUpdateListeningCodeElementRegistry(
    modelElementRegistry : registry.IModelElementRegistry,
    updateListener : IUpdateListener
) : registry.IModelElementRegistry {
    return new UpdateListeningCodeElementRegistry( modelElementRegistry, updateListener );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
