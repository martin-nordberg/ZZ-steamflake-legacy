/**
 * Module: steamflake/core/metamodel/elements
 */

import events = require( '../utilities/events' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Enumeration of possible levels of detail in JSON output.
 */
export enum JsonDetailLevel {
    Identity = 0,
    Attributes = 1,
    ParentIdentity = 2,
    ChildIdentities = 4,
    ChildAttributes = 8,
    Recursive = 16,

    FullTree = 29
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IContainerElement {}

/**
 * Top level base class for Steamflake model elements. Represents any model element with a summary and a unique ID.
 * Also provides mechanisms to add extended attributes - boolean, numeric, or string. Defines an API for converting
 * elements to and from JSON. Defines a visitor mechanism such that the visitor is called according to the element's
 * concrete type name.
 */
export interface IModelElement {

    /** A short description of this model element. */
    summary : string;

    /** What type of model element this is. NOTE: read only. */
    typeName : string;

    /** The unique ID of this model element. NOTE: read only. */
    uuid : string;

  ////

    /** Event signaling a change in some attribute of this model element. */
    attributeChangeEvent : events.IStatefulEvent<IModelElement,{attributeName:string; oldValue : any; newValue : any}>;

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
     * Whether this model element is a container element.
     */
    isContainer() : boolean;

    /**
     * @returns The parent container of this model element.
     */
    parentContainer() : IContainerElement;

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
     * @param recursingTypeNames Optionally the quoted type names for types to include children of in recursive output.
     *                       (e.g. "'RootPackage','Namespace'"). Null means recurse for all types (if flagged).
     * @returns {*} An object representing this model element for use in JSON data transfers.
     */
    toJson( level : JsonDetailLevel, recursingTypeNames? : string ) : any;

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

    /** The child elements within this container. */
    childElements: IModelElement[];

    /** Whether the children of this container have been loaded from a persistent store. */
    childElementsLoaded : boolean;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Base class representing a relationship between two model elements.
 */
export interface IModelRelationship<FromElement,ToElement>
    extends IModelElement {

    /** The element on the from side of the relationship. */
    fromElement : FromElement;

    /** The element on the to side of the relationship. */
    toElement : ToElement;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

