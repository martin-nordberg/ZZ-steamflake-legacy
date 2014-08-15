/**
 * Module: steamflake/core/metamodel/elements
 */

import events = require( '../utilities/events' );
import values = require( '../utilities/values' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Enumeration of possible levels of detail in JSON output.
 */
export enum EJsonDetailLevel {

    /** Include an element's UUID. */
    Identity = 0,

    /** Include an element's attributes. */
    Attributes = 1,

    /** Include the UUID of an element's parent. */
    ParentIdentity = 2,

    /** Include the UUIDs of an element's children. */
    ChildIdentities = 4,

    /** Include the attributes of an elements children. */
    ChildAttributes = 8,

    /** Recursively include an element's children, grandchildren, etc. */
    Recursive = 16,

    FullTree = 29
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IContainerElement { /* see below */ }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Data passed in an attribute change event. */
export interface IAttributeChangeEventData {

    /** The name of the attribute. */
    attributeName:string;

    /** The new value just set. */
    newValue : any

    /** The old value prior to the just completed change. */
    oldValue : any;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Top level base class for Steamflake model elements. Represents any model element with a summary and a unique ID.
 * Also provides mechanisms to add extended attributes - boolean, numeric, or string. Defines an API for converting
 * elements to and from JSON. Defines a visitor mechanism such that the visitor is called according to the element's
 * concrete type name.
 */
export interface IModelElement {

    /** Whether this element has been destroyed. */
    destroyed : boolean;

    /** Whether this model element is a container element. NOTE: read only. */
    isContainer : boolean;

    /** The parent container of this model element. NOTE: read only. */
    parentContainer : IContainerElement;

    /** The path of a model element relative to its parent (usually the same as its name). NOTE: read only. */
    path : string;

    /** A short description of this model element. */
    summary : string;

    /** What type of model element this is. NOTE: read only. */
    typeName : string;

    /** The unique ID of this model element. NOTE: read only. */
    uuid : string;

  ////

    /** Event signaling a change in some attribute of this model element. */
    attributeChangeEvent : events.IStatefulEvent<IModelElement,IAttributeChangeEventData>;

    /** Event signaling that this element has been removed from the model (after it is removed from its parent). */
    elementDestroyedEvent : events.IStatelessEvent<IModelElement>;

  ////

    /**
     * Dispatches this model element to a visitor based upon the concrete type name of the model element.
     * @param visitor The visitor to be passed this model element.
     * @param methodPrefix The visitor method to be called is this prefix plus the model element type name.
     * @param options Additional arbitrary argument added to the method call.
     */
    acceptVisitor(
        visitor : any,
        methodPrefix? : string,
        options? : any
    ) : any;

    /**
     * Returns the value of a given named attribute that is an extension of the statically typed model.
     * @param attributeName The name of the extended attribute.
     * @param defaultValue The default value to return if the attribute is not yet present.
     */
    getExtendedAttribute<T>( attributeName : string, defaultValue? : T ) : T;

    /**
     * Updates this model element with attributes in the given JSON object.
     * @param jsonObject Plain object with attributes read from JSON data.
     * @param notifyChangeListeners Set to false to turn off change notifications during the update.
     */
    fromJson( jsonObject : any, notifyChangeListeners? : boolean ) : void;

    /**
     * Updates the attributes of this model element from the given plain (JSON-derived) object.
     * @param jsonObject Plain object with attributes to be merged into this model element.
     */
    readJsonAttributes( jsonObject : any ) : void;

    /**
     * Changes the value of a given named attribute that is an extension of the statically typed model. Triggers
     * attributeChangeEvent in the same way as a built-in attribute..
     * @param attributeName The name of the extended attribute.
     * @param value The new value.
     */
    setExtendedAttribute<T>( attributeName : string, value : T ) : void;

    /**
     * @param level The level of detail to include in the JSON output.
     * @param recursingTypeNames Optionally, the quoted type names for types to include children of in recursive output.
     *                       (e.g. "'RootNamespace','Namespace'"). Null means recurse for all types (if flagged).
     * @returns {*} An object representing this model element for use in JSON data transfers.
     */
    toJson( level : EJsonDetailLevel, recursingTypeNames? : string ) : any;

    /**
     * Writes the attributes of this model element out to a plain object for JSON serialization.
     */
    writeJsonAttributes( jsonObject : any ) : void;

    /**
     * Writes the type, UUID, and name (when relevant) of this model element to a plain object for JSON serialization.
     */
    writeJsonIdentity( jsonObject : any ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * High level base class for Steamflake model elements that have names.
 */
export interface INamedElement
    extends IModelElement
{

    /** The name of this named model element. */
    name: string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * High level base class for Steamflake model elements that contain other elements.
 */
export interface IContainerElement
    extends IModelElement
{

    /** The child elements within this container. Note: read-only, immutable result. */
    childElements: IModelElement[];

    /** Whether the children of this container have been loaded from a persistent store. Note: read-only. */
    childElementsLoaded : boolean;

  ////

    /** Event triggered when a new child element has been fully constructed and contained by this parent. */
    childElementAddedEvent : events.IStatefulEvent<IContainerElement,IModelElement>;

    /** Event triggered when a new child element has been removed from this parent container. */
    childElementRemovedEvent : events.IStatefulEvent<IContainerElement,IModelElement>;

    /** Event triggered after the child elements of this container have been loaded from a persistent store. */
    childElementsLoadedEvent : events.IStatefulEvent<IContainerElement,IModelElement[]>;

    ////

    /**
     * Adds a child model element to this container. Triggers childElementAddedEvent.
     * @param childElement The model element to add.
     */
    addChild<Element extends IModelElement>( childElement : Element ) : Element;

    /**
     * Removes a child element from this container.
     * Note: not intended to be called directly; use IModelElement.destroy().
     * @param childElement The child element removed.
     */
    removeChild( childElement : IModelElement );

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a container that has a name.
 */
export interface INamedContainerElement
    extends IContainerElement, INamedElement {

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Marker interface for top-level containers with no parent.
 */
export interface IRootContainerElement
    extends IContainerElement
{
    // marker only
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Base class representing a relationship between two model elements.
 */
export interface IModelRelationship<FromElement,ToElement>
    extends IModelElement
{

    /** The element on the from side of the relationship. */
    fromElement : FromElement;

    /** The element on the to side of the relationship. */
    toElement : ToElement;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Do nothing/return the input function for use e.g. in promises when only the error-callback needs to do something.
 */
export function identity( modelElement : IModelElement ) {
    return modelElement;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Do-nothing/return nothing function for use in promises & other times when an element can be ignored.
 */
export function ignore( modelElement : IModelElement ) {
    return values.nothing;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
