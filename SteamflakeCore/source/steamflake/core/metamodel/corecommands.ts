
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
 * Command to change an attribute of a model element.
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
        attributeTitle : string,
        attributeName : string,
        newValue : T
    ) {

        super(
            attributeTitle + " Change",
            "Change " + attributeTitle + " from \"" + modelElement[this._attributeName] + "\" to \"" + newValue + "\""
        );

        this._attributeName = attributeName;
        this._modelElement = modelElement;
        this._newValue = newValue;
        this._oldValue = modelElement[this._attributeName];
        this._updater = updater;

    }

    public execute() {

        // make the change
        this._modelElement[this._attributeName] = this._newValue;

        // error handling: reverse the change
        function revert( reason : any ) {
            this._modelElement[this._attributeName] = this._oldValue;
            return reason;
        }

        // save the change persistently
        return this._updater.updateModelElement(
            this._modelElement,
            { changedAttributeNames:[this._attributeName] }
        ).then( elements.passThrough, revert );

    }

    public unexecute() {

        // reverse the change
        this._modelElement[this._attributeName] = this._oldValue;

        // error handling: redo the change
        function revert( reason : any ) {
            this._modelElement[this._attributeName] = this._newValue;
            return reason;
        }

        // save the change persistently
        return this._updater.updateModelElement(
            this._modelElement,
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
class ElementCreationCommand<ParentElement extends elements.IContainerElement>
    extends commands_impl.AbstractCommand<elements.IModelElement>
{

    /**
     * Constructs a new instance of this command to create a package with given attributes.
     */
    constructor(
        creator : persistence.IPersistentStoreCreator,
        deleter : persistence.IPersistentStoreDeleter,
        modelElementRegistry: registry.IModelElementRegistry,
        maker: any,
        parentElement : ParentElement,
        childType : string,
        attributes : any
    ) {
        super( childType + " Creation", "Create " + childType.toLowerCase() + " " + attributes.name );

        this._creator = creator;
        this._deleter = deleter;
        this._modelElementRegistry = modelElementRegistry;
        this._parentElement = parentElement;
        this._childType = childType;
        this._attributes = attributes;

        this._maker = maker;
    }

    public execute() {

        // create the new element and add it to its parent
        this._newChild = this._maker["make" + this._childType]( this._parentElement , this._attributes );
        this._parentElement.childElements.push( this._newChild );

        // register the new element
        this._modelElementRegistry.registerModelElement( this._newChild );

        // error handling: abandon the new element
        function revert( reason : any ) {
            var index = this._parentElement.childElements.indexOf( this._newChild );
            this._parentElement.childElements.splice(index, 1);
            this._modelElementRegistry.unregisterModelElement( this._newChild );
            return reason;
        }

        // persist the new element
        return this._creator.createModelElement( this._newChild ).then( elements.passThrough, revert );

    }

    public unexecute() {

        // remove the new element from its parent
        var index = this._parentElement.childElements.indexOf( this._newChild );
        var oldChild = this._parentElement.childElements.splice(index, 1);

        // unregister it
        this._modelElementRegistry.unregisterModelElement( this._newChild );

        // error handling: undo the deletion
        function revert( reason : any ) {
            this._parentElement.childElements.splice( index, 0, oldChild );
            this._modelElementRegistry.registerModelElement( oldChild );
        }

        // persist the deletion
        return this._deleter.deleteModelElement( this._newChild ).then( elements.ignore, revert );

    }

    private _attributes : any;

    private _childType : string;

    private _creator : persistence.IPersistentStoreCreator;

    private _deleter : persistence.IPersistentStoreDeleter;

    private _maker : any;

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _newChild;

    private _parentElement : ParentElement;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeAttributeChangeCommand<Element extends elements.IModelElement,T>(
    updater : persistence.IPersistentStoreUpdater,
    modelElement : Element,
    attributeTitle : string,
    attributeName : string,
    newValue : T
) : commands.ICommand<Element> {
    return new AttributeChangeCommand( updater, modelElement, attributeTitle, attributeName, newValue );
}

export function makeElementCreationCommand<ParentElement extends elements.IContainerElement>(
    creator : persistence.IPersistentStoreCreator,
    deleter : persistence.IPersistentStoreDeleter,
    modelElementRegistry: registry.IModelElementRegistry,
    maker: any,
    parentComponent : ParentElement,
    childTypeName : string,
    attributes : any
) : commands.ICommand<elements.IModelElement> {
    return new ElementCreationCommand<ParentElement>( creator, deleter, modelElementRegistry, maker, parentComponent, childTypeName, attributes );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

