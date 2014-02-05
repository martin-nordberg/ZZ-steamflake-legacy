/**
 * Module: steamflake/core/metamodel/elements_impl
 */

import events = require( '../utilities/events' );
import elements = require( './elements' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Top level base class for Steamflake model elements. Represents any model element with a summary and a unique ID.
 */
export class ModelElement
    implements elements.IModelElement {

    /**
     * Constructs a new code element.
     * @param parentContainer The container of this code element.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this code element.
     * @param summary A short description of this code element.
     */
    constructor(
        parentContainer : elements.IContainerElement,
        typeName: string,
        uuid : string,
        summary : string
    ) {
        this._parentContainer = parentContainer;
        this._extendedAttributes = {};
        this._summary = summary;
        this._typeName = typeName;
        this._uuid = uuid;

        this._attributeChangeEvent = events.makeStatefulEvent<elements.IModelElement,{attributeName:string; oldValue : any; newValue : any}>( this );
    }

    /**
     * Dispatches this code element to a visitor based upon the concrete type name of the code element.
     * @param visitor The visitor to be passed this code element.
     * @param methodPrefix The visitor method to be called is this prefix plus the code element type name.
     * @param options Additional arbitrary argument added to the method call.
     */
    public acceptVisitor(
        visitor : any,
        methodPrefix : string = "visit",
        options : any = undefined
    ) : any {
        if ( !visitor[ methodPrefix + this.typeName ] ) {
            var msg = "Incomplete visitor. Missing method: " + typeof(visitor) + "." + methodPrefix + this.typeName;
            console.log( "ERROR: ", msg );
            throw new Error( msg );
        }
        return visitor[ methodPrefix + this.typeName ]( this, options );
    }

    /** Returns the event for attribute changes. */
    public get attributeChangeEvent() {
        return this._attributeChangeEvent;
    }
    public set attributeChangeEvent( value : events.IStatefulEvent<elements.IModelElement,{attributeName:string; oldValue : any; newValue : any}> ) {
        throw new Error( "Attempted to change read only event - attributeChangeEvent." );
    }

    /**
     * Returns the value of a given named attribute that is an extension of the statically typed model.
     * @param attributeName The name of the extended attribute.
     * @param defaultValue The default value to return if the attribute is not yet present.
     */
    public getExtendedAttribute<T>( attributeName : string, defaultValue? : T ) : T {
        var result : T;

        result = this._extendedAttributes[ attributeName ];

        if ( typeof(result) === 'undefined' && typeof(defaultValue) !== 'undefined' ) {
            result = defaultValue;
            this._extendedAttributes[ attributeName ] = result;
        }

        return result;
    }

    /**
     * Updates this code element with attributes in the given JSON object.
     * @param jsonObject Plain object with attributes read from JSON data.
     * @param notifyChangeListeners Set to false to turn off change notifications during the update.
     */
    public fromJson( jsonObject : any, notifyChangeListeners : boolean = true ) : void {
        console.log( "fromJson" );

        if ( notifyChangeListeners ) {
            this.readJsonAttributes( jsonObject );
        }
        else {
            this._attributeChangeEvent.whileDisabledDo( function(){
                this.readJsonAttributes( jsonObject );
            } );
        }
    }

    /**
     * Whether this code element is a container element.
     */
    public get isContainer() {
        return false;
    }
    public set isContainer( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isContainer." );
    }

    /**
     * @returns {IContainerElement} The parent container of this code element.
     */
    public get parentContainer() {
        return this._parentContainer;
    }
    public set parentContainer( value : elements.IContainerElement ) {
        throw new Error( "Attempted to change read only attribute - parentContainer." );
    }

    /**
     * Updates the attributes of this code element from the given plain (JSON-derived) object.
     * @param jsonObject Plain object with attributes to be merged into this code element.
     */
    public readJsonAttributes( jsonObject : any ) : void {
        if ( typeof(jsonObject.summary) !== 'undefined' ) {
            this.summary = jsonObject.summary;
        }
    }

    /**
     * Changes the value of a given named attribute that is an extension of the statically typed model. Triggers
     * attributeChangeEvent in the same way as a built-in attribute..
     * @param attributeName The name of the extended attribute.
     * @param value The new value.
     */
    public setExtendedAttribute<T>( attributeName : string, value : T ) : void {
        var change = { attributeName: attributeName, oldValue: this._extendedAttributes[attributeName], newValue: value };
        this._extendedAttributes[attributeName] = value;
        this.attributeChangeEvent.trigger( change );
    }

    /** A short description of this code element. */
    public get summary() : string {
        return this._summary;
    }
    public set summary( value : string ) {
        var change = { attributeName: 'summary', oldValue: this._summary, newValue: value };
        this._summary = value;
        this.attributeChangeEvent.trigger( change );
    }

    /**
     * @param level The level of detail to include in the JSON output.
     * @param recursingTypeNames Optionally the quoted type names for types to include children of in recursive output.
     *                       (e.g. "'RootPackage','Namespace'"). Null means recurse for all types (if flagged).
     * @returns {*} An object representing this code element for use in JSON data transfers.
     */
    public toJson( level : elements.EJsonDetailLevel, recursingTypeNames : string = null ) : any {
        var result : any = {};

        this.writeJsonIdentity( result );

        if ( level & elements.EJsonDetailLevel.Attributes ) {
            this.writeJsonAttributes( result );
        }

        if ( level & elements.EJsonDetailLevel.ParentIdentity ) {
            result.parentContainer = {};
            this._parentContainer.writeJsonIdentity( result.parentContainer );
        }

        return result;
    }

    /** What type of code element this is. */
    public get typeName() {
        return this._typeName;
    }
    public set typeName( value : string ) {
        throw new Error( "Attempted to change read only attribute - typeName." );
    }

    /** The unique ID of this code element. */
    public get uuid() {
        return this._uuid;
    }
    public set uuid( value : string ) {
        throw new Error( "Attempted to change read only attribute - uuid." );
    }

    /**
     * Writes the attributes of this code element out to a plain object for JSON serialization.
     */
    public writeJsonAttributes( jsonObject : any ) : void {
        jsonObject.summary = this.summary;
    }

    /**
     * Writes the type, UUID, and name (when relevant) of this code element to a plain object for JSON serialization.
     */
    public writeJsonIdentity( jsonObject : any ) : void {
        jsonObject.type = this.typeName;
        jsonObject.uuid = this.uuid;
    }

  ////

    /** Object containing extended attributes. */
    private _extendedAttributes : any;

    /** The parent container of this code element. */
    private _parentContainer : elements.IContainerElement;

    /** A short description of this code element. */
    private _summary : string;

    /** What type of code element this is. */
    private _typeName : string;

    /** The unique ID of this code element. */
    private _uuid : string;

  ////

    /** Event triggered by attribute changes. */
    private _attributeChangeEvent : events.IStatefulEvent<elements.IModelElement,{attributeName:string; oldValue : any; newValue : any}>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * High level base class for Steamflake model elements that have names.
 */
export class NamedElement
    extends ModelElement
    implements elements.INamedElement
{

    /**
     * Constructs a new named model element.
     * @param parentContainer The container of this named element.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this named element.
     * @param name The name of this named element.
     * @param summary A short description of this named element.
     */
    constructor(
        parentContainer: elements.IContainerElement,
        typeName: string,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentContainer, typeName, uuid, summary );
        this._name = name;
    }

    /** The name of this named model element. */
    public get name() : string {
        return this._name;
    }
    public set name( value : string ) {
        var change = { attributeName: 'name', oldValue: this._name, newValue: value };
        this._name = value;
        this.attributeChangeEvent.trigger( change );
    }
    /**
     * Updates the attributes of this code element from the given plain (JSON-derived) object.
     * @param jsonObject Plain object with attributes to be merged into this code element.
     */
    public readJsonAttributes( jsonObject : any ) : void {
        super.readJsonAttributes( jsonObject );
        console.log( "new name", jsonObject.name );
        if ( typeof(jsonObject.name) !== "undefined" ) {
            console.log( "changing name" );
            this.name = jsonObject.name;
        }
    }

    /**
     * Writes the identity of this named element out to a plain object for JSON serialization.
     */
    public writeJsonIdentity( jsonObject : any ) : void {
        super.writeJsonIdentity( jsonObject );
        jsonObject.name = this.name;
    }

    /** The name of this named code element. */
    public _name: string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * High level base class for named model elements that contain other elements.
 */
export class NamedContainerElement
    extends NamedElement
    implements elements.IContainerElement, elements.INamedElement
{

    /**
     * Constructs a new code container element.
     * @param parentContainer The parent element containing this element.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of the code element.
     * @param name The name of the code element.
     * @param summary A short description of this code element.
     */
    constructor(
        parentContainer: elements.IContainerElement,
        typeName: string,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentContainer, typeName, uuid, name, summary );
        this._childElements = [];
        this._childElementsLoaded = false;
    }

    /** The child elements of this container. */
    public get childElements() {
        return this._childElements;
    }
    public set childElements( value : elements.IModelElement[] ) {
        throw new Error( "Attempted to change read only attribute - childElements." );
    }

    /** Whether the child elements of this container have been loaded from a persistent store. */
    public get childElementsLoaded() {
        return this._childElementsLoaded;
    }
    public set childElementsLoaded( value : boolean ) {
        this._childElementsLoaded = value;
        // TBD: this probably deserves an event
    }

    /**
     * Whether this code element is a container element.
     */
    public get isContainer() {
        return true;
    }

    /**
     * @returns {*} An object representing this named code element for use in JSON data transfers.
     */
    public toJson( level: elements.EJsonDetailLevel, recursingTypeNames : string = null ) : any {
        var result = super.toJson( level );

        if (
            ( level & elements.EJsonDetailLevel.ChildIdentities ) &&
                this._childElementsLoaded &&
                ( recursingTypeNames === null || recursingTypeNames.indexOf( "'"+this.typeName+"'" ) >= 0 )
            ) {
            var childLevel = elements.EJsonDetailLevel.Identity;
            if ( level & elements.EJsonDetailLevel.ChildAttributes ) {
                childLevel = childLevel | elements.EJsonDetailLevel.Attributes;
            }
            if ( level & elements.EJsonDetailLevel.Recursive ) {
                childLevel = childLevel | ( level & elements.EJsonDetailLevel.ChildIdentities );
                childLevel = childLevel | ( level & elements.EJsonDetailLevel.ChildAttributes );
                childLevel = childLevel | elements.EJsonDetailLevel.Recursive;
            }

            result.childElements = [ ];
            this._childElements.forEach( function( element : elements.IModelElement ) {
                result.childElements.push( element.toJson( childLevel, recursingTypeNames ) );
            } );
        }

        return result;
    }

    /** The child elements within this container. */
    public _childElements: elements.IModelElement[];

    /** Whether the children of this container have been loaded from a persistent store. */
    public _childElementsLoaded : boolean;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

