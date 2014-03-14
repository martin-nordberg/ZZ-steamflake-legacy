
/**
 * Module: steamflake/core/metamodel/listeners
 */

import commands = require( '../concurrency/commands' );
import corecommands = require( './corecommands' );
import elements = require( './elements' );
import persistence = require( './persistence' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Service that listens for changes in Steamflake model elements and passes them on to commands that update a
 * persistence layer.
 */
class UpdateListener {

    /**
     * Constructs a new update listener.
     */
    constructor(
        creator : persistence.IPersistentStoreCreator,
        updater : persistence.IPersistentStoreUpdater,
        deleter : persistence.IPersistentStoreDeleter,
        commandHistory : commands.ICommandHistory
    ) {
        var self = this;

        self._commandHistory = commandHistory;

        self._attributeChangeListener = function(
            modelElement : elements.IModelElement,
            change : elements.IAttributeChangeEventData
        ) {
            var cmd = corecommands.makeAttributeChangeCommand( updater, modelElement, change.attributeName, change.oldValue );
            self._commandHistory.queue( cmd );
        }

        self._childElementAddedListener = function(
            containerElement : elements.IContainerElement,
            childElement : elements.IModelElement
        ) {
            var cmd = corecommands.makeElementCreationCommand( creator, deleter, undefined/*TBD*/, childElement );
            self._commandHistory.queue( cmd );
        }
    }

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    public startListening(
        modelElement : elements.IModelElement
    ) : void {
        modelElement.attributeChangeEvent.registerListener( this._attributeChangeListener );
        // TBD: model element creation
        // TBD: model element deletion
    }

    /**
     * Unregisters a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    public stopListening(
        modelElement : elements.IModelElement
    ) : void {
        modelElement.attributeChangeEvent.unregisterListener( this._attributeChangeListener );
        // TBD: model element creation
        // TBD: model element deletion
    }

    private _attributeChangeListener : ( modelElement : elements.IModelElement, change : elements.IAttributeChangeEventData ) => void;

    private _childElementAddedListener : ( containerElement : elements.IContainerElement, childElement : elements.IModelElement ) => void;

    private _commandHistory : commands.ICommandHistory;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A code element registry that also registers code elements with a persistent store updater to track changes.
 */
class UpdateListeningCodeElementRegistry
    implements registry.IModelElementRegistry
{

    /**
     * Constructs a registry from an inner registry and an updater.
     */
    constructor(
        modelElementRegistry : registry.IModelElementRegistry,
        creator : persistence.IPersistentStoreCreator,
        updater : persistence.IPersistentStoreUpdater,
        deleter : persistence.IPersistentStoreDeleter,
        commandHistory : commands.ICommandHistory
    ) {
        this._modelElementRegistry = modelElementRegistry;
        this._updateListener = new UpdateListener( creator, updater, deleter, commandHistory );
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
        this._updateListener.startListening( modelElement );
    }

    /**
     * Removes a code element from this registry.
     */
    public unregisterModelElement( modelElement : elements.IModelElement ) : void {
        this._updateListener.stopListening( modelElement );
        this._modelElementRegistry.unregisterModelElement( modelElement );
    }

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _updateListener : UpdateListener;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeUpdateListeningCodeElementRegistry(
    modelElementRegistry : registry.IModelElementRegistry,
    creator : persistence.IPersistentStoreCreator,
    updater : persistence.IPersistentStoreUpdater,
    deleter : persistence.IPersistentStoreDeleter,
    commandHistory : commands.ICommandHistory = commands.makeNullCommandHistory()
) : registry.IModelElementRegistry {
    return new UpdateListeningCodeElementRegistry( modelElementRegistry, creator, updater, deleter, commandHistory );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
