
/**
 * Module: steamflake/core/metamodel/corecommands
 */

import commands = require( '../utilities/commands' );
import commands_impl = require( '../utilities/commands_impl' );
import elements = require( './elements' );
import persistence = require( './persistence' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Command to change an attribute of a model element.
 */
class AttributeChangeCommand<Element extends elements.IModelElement,T>
    extends commands_impl.AbstractCommand<T>
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
        super( attributeTitle + " Change", "Change " + attributeTitle + " from \"" + modelElement[this._attributeName] + "\" to \"" + newValue + "\"" );
        this._attributeName = attributeName;
        this._modelElement = modelElement;
        this._newValue = newValue;
        this._oldValue = modelElement[this._attributeName];
        this._updater = updater;
    }

    public execute() {
        // make the change
        this._modelElement[this._attributeName] = this._newValue;

        // save the change persistently
        this._updater.updateModelElement( this._modelElement, { changedAttributeNames:[this._attributeName], fail:function(err:any){/*TBD*/} } );

        return this._newValue;
    }

    public unexecute() : void {
        // reverse the change
        this._modelElement[this._attributeName] = this._oldValue;

        // save the change persistently
        this._updater.updateModelElement( this._modelElement, { changedAttributeNames:[this._attributeName], fail:function(err:any){/*TBD*/} } );
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

    public execute() : elements.IModelElement {
        // create the new element and add it to its parent
        this._newChild = this._maker["make" + this._childType]( this._parentElement , this._attributes );
        this._parentElement.childElements.push( this._newChild );

        // register the new element
        this._modelElementRegistry.registerModelElement( this._newChild );

        // persist the new element
        this._creator.createModelElement( this._newChild, { succeed:function(lzChild:elements.IModelElement){} } );

        return this._newChild;
    }

    public unexecute() : void {
        // remove the new element from its parent
        var index = this._parentElement.childElements.indexOf( this._newChild );
        this._parentElement.childElements.splice(index, 1);

        // unregister it
        this._modelElementRegistry.unregisterModelElement( this._newChild );

        // persist the deletion
        this._deleter["delete" + this._childType]( this._newChild, {} );
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
) : commands.ICommand<T> {
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

