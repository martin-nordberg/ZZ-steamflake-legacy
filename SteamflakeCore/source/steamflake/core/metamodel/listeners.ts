
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

        // respond to attribute changes
        self._attributeChangeListener = function(
            modelElement : elements.IModelElement,
            change : elements.IAttributeChangeEventData
        ) {
            var cmd = corecommands.makeAttributeChangeCommand( updater, modelElement, change.attributeName, change.oldValue );
            self._commandHistory.queue( cmd );
        };

        // respond to added child elements (i.e. element creation)
        self._childElementAddedListener = function(
            containerElement : elements.IContainerElement,
            childElement : elements.IModelElement
        ) {
            var cmd = corecommands.makeElementCreationCommand( creator, deleter, undefined/*TBD*/, childElement );
            self._commandHistory.queue( cmd );
        };
    }

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    public startListening(
        modelElement : elements.IModelElement
    ) : void {

        modelElement.attributeChangeEvent.registerListener( this._attributeChangeListener );

        if ( modelElement.isContainer ) {
            ( <elements.IContainerElement> modelElement ).childElementAddedEvent.registerListener( this._childElementAddedListener );
        }

        // TBD: model element deletion

    }

    /**
     * Unregisters a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    public stopListening(
        modelElement : elements.IModelElement
    ) : void {

        // TBD: model element deletion

        if ( modelElement.isContainer ) {
            ( <elements.IContainerElement> modelElement ).childElementAddedEvent.unregisterListener( this._childElementAddedListener );
        }

        modelElement.attributeChangeEvent.unregisterListener( this._attributeChangeListener );

    }

    private _attributeChangeListener : ( modelElement : elements.IModelElement, change : elements.IAttributeChangeEventData ) => void;

    private _childElementAddedListener : ( containerElement : elements.IContainerElement, childElement : elements.IModelElement ) => void;

    private _commandHistory : commands.ICommandHistory;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A model element registry that adds or removes persistence update listening when elements are registered
 * or unregistered.
 */
class UpdatePersistingModelElementRegistryListener {

    /**
     * Constructs a registry from an inner registry and an updater.
     */
    constructor(
        modelElementRegistry : registry.IModelElementRegistry,
        updateListener : UpdateListener
    ) {

        // responds when an element is registered
        var registrationListener = function( r : registry.IModelElementRegistry, modelElement : elements.IModelElement ) {
            updateListener.startListening( modelElement );
        };

        // responds when an element is unregistered
        var unregistrationListener = function( r : registry.IModelElementRegistry, modelElement : elements.IModelElement ) {
            updateListener.stopListening( modelElement );
        };

        modelElementRegistry.elementRegisteredEvent.registerListener( registrationListener );
        modelElementRegistry.elementUnregisteredEvent.registerListener( unregistrationListener );

    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new model element registry that also maintains update listening to persist model changes.
 * @param modelElementRegistry The inner model element registry to wrap with update listening.
 * @param creator The persistence creation service.
 * @param updater The persistence update service.
 * @param deleter The persistence deletion service.
 * @param commandHistory The command history to maintain with update commands.
 * @returns {UpdateListeningCodeElementRegistry}
 */
export function addAutomaticUpdatePersistence(
    modelElementRegistry : registry.IModelElementRegistry,
    creator : persistence.IPersistentStoreCreator,
    updater : persistence.IPersistentStoreUpdater,
    deleter : persistence.IPersistentStoreDeleter,
    commandHistory : commands.ICommandHistory = commands.makeNullCommandHistory()
) {

    var updateListener = new UpdateListener( creator, updater, deleter, commandHistory );

    new UpdatePersistingModelElementRegistryListener( modelElementRegistry, updateListener );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
