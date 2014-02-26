
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
            "Change " + attributeName + " from \"" + oldValue + "\" to \"" + modelElement[this._attributeName] + "\""
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
class ElementCreationCommand<ParentElement extends elements.IContainerElement,ChildElement extends elements.IModelElement>
    extends commands_impl.AbstractCommand<ChildElement>
{

    /**
     * Constructs a new instance of this command to create a package with given attributes.
     */
    constructor(
        creator : persistence.IPersistentStoreCreator,
        deleter : persistence.IPersistentStoreDeleter,
        modelElementRegistry: registry.IModelElementRegistry,
        parentElement : ParentElement,
        childElement : ChildElement,
        childType : string,
        attributes : any
    ) {
        super( childType + " Creation", "Create " + childType.toLowerCase() + " " + attributes.name );

        this._creator = creator;
        this._deleter = deleter;
        this._modelElementRegistry = modelElementRegistry;
        this._parentElement = parentElement;
        this._childElement = childElement;
        this._childType = childType;
        this._attributes = attributes;
    }

    public execute() {

        var self = this;

        // register the new element
        self._modelElementRegistry.registerModelElement( this._childElement );

        // error handling: abandon the new element
        function revert( reason : any ) {
            self._parentElement.childElementRemovedEvent.whileDisabledDo( function() {
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
        self._parentElement.childElementAddedEvent.whileDisabledDo( function() {
            self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                self._childElement.destroyed = false;
            } );
        } );

        // register it
        this._modelElementRegistry.registerModelElement( this._childElement );

        // error handling: undo the addition
        function revert( reason : any ) {
            self._parentElement.childElementRemovedEvent.whileDisabledDo( function() {
                self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                    self._childElement.destroyed = true;
                } );
            } );
            this._modelElementRegistry.unregisterModelElement( self._childElement );
            return reason;
        }

        // persist the deletion
        return this._creator.createModelElement( self._childElement ).then( elements.ignore, revert );

    }

    public unexecute() {

        var self = this;

        // remove the new element from its parent
        self._parentElement.childElementRemovedEvent.whileDisabledDo( function() {
            self._childElement.elementDestroyedEvent.whileDisabledDo( function() {
                self._childElement.destroyed = true;
            } );
        } );

        // unregister it
        this._modelElementRegistry.unregisterModelElement( this._childElement );

        // error handling: undo the deletion
        function revert( reason : any ) {
            self._parentElement.childElementAddedEvent.whileDisabledDo( function() {
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

    private _attributes : any;

    private _childElement : ChildElement;

    private _childType : string;

    private _creator : persistence.IPersistentStoreCreator;

    private _deleter : persistence.IPersistentStoreDeleter;

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _parentElement : ParentElement;

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

export function makeElementCreationCommand<ParentElement extends elements.IContainerElement,ChildElement extends elements.IModelElement>(
    creator : persistence.IPersistentStoreCreator,
    deleter : persistence.IPersistentStoreDeleter,
    modelElementRegistry: registry.IModelElementRegistry,
    parentComponent : ParentElement,
    childElement : ChildElement,
    childTypeName : string,
    attributes : any
) : commands.ICommand<elements.IModelElement> {
    return new ElementCreationCommand<ParentElement,ChildElement>( creator, deleter, modelElementRegistry, parentComponent, childElement, childTypeName, attributes );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

