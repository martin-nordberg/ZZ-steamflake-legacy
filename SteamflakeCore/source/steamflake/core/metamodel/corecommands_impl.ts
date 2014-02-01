
/**
 * Module: lzero/language/metamodel/foundationcommands
 */

import commands = require( '../utilities/commands' );
import commands_impl = require( '../utilities/commands_impl' );
import corecommands = require( './corecommands' );
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
        modelElement : Element,
        attributeTitle : string,
        attributeName : string,
        newValue : T
    ) {
        super( attributeTitle + " Change", "Change " + attributeTitle + " from \"" + modelElement[this._attributeName] + "\" to \"" + newValue + "\"" );
        this._modelElement = modelElement;
        this._attributeName = attributeName;
        this._newValue = newValue;
        this._oldValue = modelElement[this._attributeName];
    }

    public execute() {
        this._modelElement[this._attributeName] = this._newValue;
        return this._newValue;
    }

    public unexecute() : void {
        this._modelElement[this._attributeName] = this._oldValue;
    }

    private _attributeName : string;

    private _modelElement : Element;

    private _newValue: T;

    private _oldValue : T;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Command to create a new model element generically.
 */
class ElementCreationCommand<ParentElement extends elements.IContainerElement,ChildElement extends elements.IContainedElement<ParentElement>>
    extends commands_impl.AbstractCommand<ChildElement>
{

    /**
     * Constructs a new instance of this command to create a package with given attributes.
     */
    constructor(
        creator : persistence.IPersistentStoreCreator,
        deleter : persistence.IPersistentStoreDeleter,
        modelElementRegistry: registry.IModelElementRegistry,
        maker: any,
        lzParentComponent : ParentElement,
        childType : string,
        attributes : any
    ) {
        super( childType + " Creation", "Create " + childType.toLowerCase() + " " + attributes.name );

        this._creator = creator;
        this._deleter = deleter;
        this._modelElementRegistry = modelElementRegistry;
        this._parentComponent = lzParentComponent;
        this._childType = childType;
        this._attributes = attributes;

        this._maker = maker;
    }

    public execute() : ChildElement {
        // TBD: Call addXxx directly? (i.e. do without helper class above)
        this._newChild = this._maker["make" + this._childType]( this._parentComponent , this._attributes );
        this._parentComponent.childElements.push( this._newChild );

        this._creator.createModelElement( this._newChild, { succeed:function(lzChild:ChildElement){} } );

        this._modelElementRegistry.registerModelElement( this._newChild );

        return this._newChild;
    }

    public unexecute() : void {
        var index = this._parentComponent.childElements.indexOf( this._newChild );
        this._parentComponent.childElements.splice(index, 1);

        this._deleter["delete" + this._childType]( this._newChild, {} );

        this._modelElementRegistry.unregisterModelElement( this._newChild );
    }

    private _attributes : any;

    private _childType : string;

    private _creator : persistence.IPersistentStoreCreator;

    private _deleter : persistence.IPersistentStoreDeleter;

    private _maker : any;

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _newChild;

    private _parentComponent : ParentElement;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function initialize() {

    if ( typeof corecommands.makeAttributeChangeCommand === 'undefined' ) {
        corecommands.makeAttributeChangeCommand =
            function<Element extends elements.IModelElement,T>(
                modelElement : Element,
                attributeTitle : string,
                attributeName : string,
                newValue : T
            ) {
                return new AttributeChangeCommand( modelElement, attributeTitle, attributeName, newValue );
            };
    }

// TBD: Exceeds the generic capabilities of Typescript
//    if ( typeof corecommands.makeElementCreationCommand === 'undefined' ) {
//        corecommands.makeElementCreationCommand =
//            function<ParentElement extends elements.IContainerElement,ChildElement extends elements.IContainedElement<ParentElement>>(
//                creator : persistence.IPersistentStoreCreator,
//                deleter : persistence.IPersistentStoreDeleter,
//                modelElementRegistry: registry.IModelElementRegistry,
//                maker: any,
//                parentComponent : ParentElement,
//                childTypeName : string,
//                attributes : any
//            ) {
//                return new ElementCreationCommand( creator, deleter, modelElementRegistry, maker, parentComponent, childTypeName, attributes );
//            };
//    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

