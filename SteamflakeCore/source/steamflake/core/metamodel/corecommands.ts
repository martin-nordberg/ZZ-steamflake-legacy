
/**
 * Module: steamflake/core/metamodel/corecommands
 */

import commands = require( '../concurrency/commands' );
import commands_impl = require( '../concurrency/commands_impl' );
import elements = require( './elements' );
import persistence = require( './persistence' );
import promises = require( '../concurrency/promises' );
import registry = require( './registry' );
import values = require( '../utilities/values' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Command to persist a model element after one of its attributes has changed.
 */
class AttributeChangeCommand<Element extends elements.IModelElement,T>
    extends commands_impl.AbstractCommand<Element>
{

    /**
     * Constructs a new instance of this command to act upon the given code element.
     */
    constructor(
        updater : persistence.IPersistentStoreUpdater,
        modelElement : Element,
        attributeName : string,
        oldValue : T
    ) {

        super(
            // TBD: UI strings from config file with internationalization
            attributeName[0].toUpperCase() + attributeName.substring(1) + " Change",
            "Change " + attributeName + " from \"" + oldValue + "\" to \"" + modelElement[attributeName] + "\""
        );

        this._attributeName = attributeName;
        this._modelElement = modelElement;
        this._newValue = modelElement[this._attributeName];
        this._oldValue = oldValue;
        this._updater = updater;

    }

    public execute() {

        var self = this;

        // error handling: reverse the change
        function revert( reason : any ) {
            self._modelElement.attributeChangeEvent.whileDisabledDo( function() {
                self._modelElement[this._attributeName] = this._oldValue;
            } );
            return reason;
        }

        // save the change persistently
        return self._updater.updateModelElement(
            self._modelElement,
            { changedAttributeNames:[this._attributeName] }
        ).then( elements.identity, revert );

    }

    public reexecute() {

        var self = this;

        // reapply the change
        self._modelElement[this._attributeName] = this._newValue;

        // error handling: undo the change
        function revert( reason : any ) {
            self._modelElement.attributeChangeEvent.whileDisabledDo( function() {
                self._modelElement[this._attributeName] = this._oldValue;
            } );
            return reason;
        }

        // save the change persistently
        return self._updater.updateModelElement(
            self._modelElement,
            { changedAttributeNames:[this._attributeName] }
        ).then( elements.ignore, revert );

    }

    public unexecute() {

        var self = this;

        // reverse the change
        self._modelElement[this._attributeName] = this._oldValue;

        // error handling: redo the change
        function revert( reason : any ) {
            self._modelElement.attributeChangeEvent.whileDisabledDo( function() {
                self._modelElement[this._attributeName] = this._newValue;
            } );
            return reason;
        }

        // save the change persistently
        return self._updater.updateModelElement(
            self._modelElement,
            { changedAttributeNames:[this._attributeName] }
        ).then( elements.ignore, revert );

    }

    private _attributeName : string;

    private _modelElement : Element;

    private _newValue: T;

    private _oldValue : T;

    private _updater : persistence.IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Command to create a new model element generically.
 */
class ElementCreationCommand<ChildElement extends elements.IModelElement>
    extends commands_impl.AbstractCommand<ChildElement>
{

    /**
     * Constructs a new instance of this command to make element creation reversible.
     */
    constructor(
        creator : persistence.IPersistentStoreCreator,
        deleter : persistence.IPersistentStoreDeleter,
        modelElementRegistry: registry.IModelElementRegistry,
        childElement : ChildElement
    ) {
        function makeDescription() {
            var result = "Create " + childElement.typeName.toLowerCase();
            if ( childElement['name'] ) {
                result += " " + childElement['name'];
            }
            return result;
        }

        super( childElement.typeName + " Creation", makeDescription() );

        this._creator = creator;
        this._deleter = deleter;
        this._modelElementRegistry = modelElementRegistry;
        this._childElement = childElement;
    }

    public execute() {

        var self = this;

        // register the new element
        self._modelElementRegistry.registerModelElement( self._childElement );

        // error handling: abandon the new element
        function revert( reason : any ) {
            self._childElement.parentContainer.childElementRemovedEvent.whileDisabledDo( function() {
                self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                    self._childElement.destroyed = true;
                })
            } );
            self._modelElementRegistry.unregisterModelElement( self._childElement );
            return reason;
        }

        // persist the new element
        return self._creator.createModelElement( self._childElement ).then( elements.identity, revert );

    }

    public reexecute() {

        var self = this;

        // add the child back to its parent
        self._childElement.parentContainer.childElementAddedEvent.whileDisabledDo( function() {
            self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                self._childElement.destroyed = false;
            } );
        } );

        // persist the deletion
        return this.execute().then( elements.ignore );

    }

    public unexecute() {

        var self = this;

        // remove the new element from its parent
        self._childElement.parentContainer.childElementRemovedEvent.whileDisabledDo( function() {
            self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                self._childElement.destroyed = true;
            } );
        } );

        // unregister it
        this._modelElementRegistry.unregisterModelElement( this._childElement );

        // error handling: undo the deletion
        function revert( reason : any ) {
            self._childElement.parentContainer.childElementAddedEvent.whileDisabledDo( function() {
                self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                    self._childElement.destroyed = false;
                } );
            } );
            this._modelElementRegistry.registerModelElement( self._childElement );
            return reason;
        }

        // persist the deletion
        return this._deleter.deleteModelElement( self._childElement ).then( elements.ignore, revert );

    }

    private _childElement : ChildElement;

    private _creator : persistence.IPersistentStoreCreator;

    private _deleter : persistence.IPersistentStoreDeleter;

    private _modelElementRegistry : registry.IModelElementRegistry;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Command to delete a new model element generically.
 * TBD: Where to delete/undelete child elements?
 */
class ElementDeletionCommand<ChildElement extends elements.IModelElement>
    extends commands_impl.AbstractCommand<ChildElement>
{

    /**
     * Constructs a new instance of this command to make element deletion reversible.
     */
    constructor(
        creator : persistence.IPersistentStoreCreator,
        deleter : persistence.IPersistentStoreDeleter,
        modelElementRegistry: registry.IModelElementRegistry,
        childElement : ChildElement
    ) {
        function makeDescription() {
            var result = "Delete " + childElement.typeName.toLowerCase();
            if ( childElement['name'] ) {
                result += " " + childElement['name'];
            }
            return result;
        }

        super( childElement.typeName + " Deletion", makeDescription() );

        this._creator = creator;
        this._deleter = deleter;
        this._modelElementRegistry = modelElementRegistry;
        this._childElement = childElement;
    }

    public execute() {

        var self = this;

        // unregister the deleted element
        self._modelElementRegistry.unregisterModelElement( self._childElement );

        // error handling: can't delete it
        function revert( reason : any ) {
            self._childElement.parentContainer.childElementAddedEvent.whileDisabledDo( function() {
                self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                    self._childElement.destroyed = false;
                })
            } );
            self._modelElementRegistry.registerModelElement( self._childElement );
            return reason;
        }

        // persist the deleted element
        return self._deleter.deleteModelElement( self._childElement ).then( elements.identity, revert );

    }

    public reexecute() {

        var self = this;

        // re-destroy the element
        self._childElement.parentContainer.childElementRemovedEvent.whileDisabledDo( function() {
            self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                self._childElement.destroyed = true;
            } );
        } );

        // persist the deletion
        return this.execute().then( elements.ignore );

    }

    public unexecute() {

        var self = this;

        // add the element back to its parent
        self._childElement.parentContainer.childElementRemovedEvent.whileDisabledDo( function() {
            self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                self._childElement.destroyed = false;
            } );
        } );

        // register it
        this._modelElementRegistry.registerModelElement( this._childElement );

        // error handling: redo the deletion
        function revert( reason : any ) {
            self._childElement.parentContainer.childElementRemovedEvent.whileDisabledDo( function() {
                self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                    self._childElement.destroyed = true;
                } );
            } );
            this._modelElementRegistry.unregisterModelElement( self._childElement );
            return reason;
        }

        // persist the undeletion
        return this._creator.createModelElement( self._childElement ).then( elements.ignore, revert );

    }

    private _childElement : ChildElement;

    private _creator : persistence.IPersistentStoreCreator;

    private _deleter : persistence.IPersistentStoreDeleter;

    private _modelElementRegistry : registry.IModelElementRegistry;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeAttributeChangeCommand<Element extends elements.IModelElement,T>(
    updater : persistence.IPersistentStoreUpdater,
    modelElement : Element,
    attributeName : string,
    newValue : T
) : commands.ICommand<Element> {
    return new AttributeChangeCommand( updater, modelElement, attributeName, newValue );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeElementCreationCommand<ChildElement extends elements.IModelElement>(
    creator : persistence.IPersistentStoreCreator,
    deleter : persistence.IPersistentStoreDeleter,
    modelElementRegistry: registry.IModelElementRegistry,
    childElement : ChildElement
) : commands.ICommand<elements.IModelElement> {
    return new ElementCreationCommand<ChildElement>( creator, deleter, modelElementRegistry, childElement );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeElementDeletionCommand<ChildElement extends elements.IModelElement>(
    creator : persistence.IPersistentStoreCreator,
    deleter : persistence.IPersistentStoreDeleter,
    modelElementRegistry: registry.IModelElementRegistry,
    childElement : ChildElement
) : commands.ICommand<elements.IModelElement> {
    return new ElementDeletionCommand<ChildElement>( creator, deleter, modelElementRegistry, childElement );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

