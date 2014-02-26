
/**
 * Module: steamflake/model/structure
 */

import elements = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/elements_impl' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IClass {}
export interface IModule {}
export interface INamespace {}
export interface IPackage {}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A parameter represents one potential argument to a function.
 */
export interface IParameter
    extends elements.INamedElement
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A variable holds a local value inside a function.
 */
export interface IVariable
    extends elements.INamedElement
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A namespace is a naming structure distinguishing modules. Namespaces are packages bigger than a module, smaller
 * than the root package.
 */
export interface IAbstractNamespace
    extends elements.IContainerElement
{

    /**
     * Constructs a new module inside this namespace.
     * @param uuid The unique ID of the new module.
     * @param attributes
     *         .name The name of the new module.
     *         .summary A short description of the new module.
     *         .version The version number of the new module.
     */
    makeModule(
        uuid: string,
        attributes: any
    ) : IModule;

    /**
     * Constructs a new namespace inside this one.
     * @param uuid The unique ID of the new namespace.
     * @param attributes
     *         .name The name of the new namespace.
     *         .summary A short description of the new namespace.
     */
    makeNamespace(
        uuid: string,
        attributes: any
    ) : INamespace;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function signature represents the name and parameters of a function.
 */
export interface IFunctionSignature
    extends elements.IContainerElement
{

    /**
     * Whether this function is exported from its parent container.
     */
    isExported: boolean;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An interface represents the behavior of a component.
 */
export interface IInterface
    extends elements.IContainerElement
{

    /** Whether this interface is visible outside its parent container. */
    isExported: boolean;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A namespace is a naming structure distinguishing modules.
 */
export interface INamespace
    extends IAbstractNamespace
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A root package represents the nameless top level package..
 */
export interface IRootPackage
    extends IAbstractNamespace, elements.IRootContainerElement
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function represents an executable sequence of statements. For a module, it's the 'main' function of the module.
 * For a package it's the initializer of the package. For a component it's the constructor of the component. An operation
 * is itself simply a single function.
 */
export interface IFunction
    extends IFunctionSignature
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An operation is a single function signature within an interface.
 */
export interface IOperation
    extends IFunctionSignature
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A method is a concrete function implementation within a component.
 */
export interface IMethod
    extends IFunction
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A component represents a reusable element of behavior.
 */
export interface IComponent
    extends IFunction
{

    /**
     * Constructs a new class inside this component.
     * @param uuid The unique ID of the new class.
     * @param attributes
     *         .name The name of the new class.
     *         .summary A summary of the new class.
     *         .isExported Whether this class is exported from its containing component.
     */
    makeClass(
        uuid: string,
        attributes: any
    ) : IClass;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An abstract package collects related components.
 */
export interface IAbstractPackage
    extends IComponent
{

    /**
     * Constructs a new package inside this one.
     * @param uuid The unique ID of the new package.
     * @param attributes.name The name of the new package.
     * @param attributes.summary A short description of the new package.
     * @param attributes.isExported Whether the new package is accessible outside its parent package.
     */
    makePackage(
        uuid : string,
        attributes: any
    ) : IPackage;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An annotation serves as a marker for other code elements.
 */
export interface IAnnotation
    extends IComponent
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A class describes a concrete component with identity, state, and behavior.
 */
export interface IClass
     extends IComponent
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An enumeration of a finite set of instances.
 */
export interface IEnumeration
    extends IComponent
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A module is a deployable package.
 */
export interface IModule
extends IAbstractPackage
{

    /** The version of this module. */
    version : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A package collects related components.
 */
export interface IPackage
    extends IAbstractPackage
{

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function signature represents the name and parameters of a function.
 */
class Parameter
    extends elements_impl.NamedElement
    implements IParameter
{

    /**
     * Constructs a new parameter.
     * @param parentFunctionSignature The parent element containing this element.
     * @param uuid The unique ID of this parameter.
     * @param name The name of the code element.
     * @param summary A short description of this parameter.
     */
    constructor(
        parentFunctionSignature: IFunctionSignature,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentFunctionSignature, "Parameter", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A variable holds a local value inside a function.
 */
export class Variable
    extends elements_impl.NamedElement
    implements IVariable
{

    /**
     * Constructs a new variable.
     * @param parentFunction The parent element containing this element.
     * @param uuid The unique ID of this variable.
     * @param name The name of this variable code element.
     * @param summary A short description of this variable.
     */
    constructor(
        parentFunction: IFunction,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentFunction, "Variable", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A namespace is a naming structure distinguishing modules. Namespaces are packages bigger than a module, smaller
 * than the root package.
 */
export class AbstractNamespace
    extends elements_impl.NamedContainerElement
    implements IAbstractNamespace
{

    /**
     * Constructs a new abstract namespace.
     * @param parentNamespace The parent namespace containing this namespace.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this namespace.
     * @param name The name of this namespace.
     * @param summary A short description of this namespace.
     */
    constructor(
        parentNamespace: IAbstractNamespace,
        typeName: string,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentNamespace, typeName, uuid, name, summary );
    }

    /**
     * Constructs a new module inside this namespace.
     * @param uuid The unique ID of the new module.
     * @param name The name of the new module.
     * @param summary A short description of the new module.
     * @param version The version number of the new module.
     */
    public makeModule(
        uuid: string,
        attributes: any
    ) : IModule {
        var result = new Module( this, uuid, attributes.name, attributes.summary, attributes.version );
        this.addChild( result );
        return result;
    }

    /**
     * Constructs a new namespace inside this one.
     * @param uuid The unique ID of the new namespace.
     * @param name The name of the new namespace.
     * @param summary A short description of the new namespace.
     */
    public makeNamespace(
        uuid: string,
        attributes: any
    ) : INamespace {
        var result = new Namespace( this, uuid, attributes.name, attributes.summary );
        this.addChild( result );
        return result;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function signature represents the name and parameters of a function.
 */
export class FunctionSignature
    extends elements_impl.NamedContainerElement
    implements IFunctionSignature
{

    /**
     * Constructs a new function signature.
     * @param parentContainer The parent element containing this element.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of the code element.
     * @param name The name of the code element.
     * @param summary A short description of this code element.
     * @param isExported Whether this function signature is accessible outside its container.
     */
    constructor(
        parentContainer: elements.IContainerElement,
        typeName: string,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentContainer, typeName, uuid, name, summary );
        this._isExported = isExported;
    }

    /**
     * Whether this function is exported from its parent container.
     */
    public get isExported() {
        return this._isExported;
    }
    public set isExported( value : boolean ) {
        this._isExported = value;
    }

    /**
     * Updates the attributes of this code element from the given plain (JSON-derived) object.
     * @param jsonObject Plain object with attributes to be merged into this code element.
     */
    public readJsonAttributes( jsonObject : any ) : void {
        super.readJsonAttributes( jsonObject );
        if ( typeof jsonObject.isExported !== 'undefined' ) {
            this.isExported = jsonObject.isExported;
        }
    }

    /**
     * Writes the attributes of this code element out to a plain object for JSON serialization.
     */
    public writeJsonAttributes( jsonObject : any ) : void {
        super.writeJsonAttributes( jsonObject );
        jsonObject.isExported = this.isExported;
    }

    private _isExported: boolean;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An interface represents the behavior of a component.
 */
export class Interface
    extends elements_impl.NamedContainerElement
    implements IInterface
{

    /**
     * Constructs a new interface.
     * @param parentContainer The parent component containing this interface.
     * @param uuid The unique ID of this interface.
     * @param name The name of this interface.
     * @param summary A short description of this interface.
     * @param isExported Whether this interface is accessible outside its container.
     */
    constructor(
        parentComponent: IComponent,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentComponent, "Interface", uuid, name, summary );
        this._isExported = isExported;
    }

    /**
     * Whether this interface is exported from its parent container.
     */
    public get isExported() {
        return this._isExported;
    }
    public set isExported( value : boolean ) {
        this._isExported = value;
    }

    /**
     * Updates the attributes of this code element from the given plain (JSON-derived) object.
     * @param jsonObject Plain object with attributes to be merged into this code element.
     */
    public readJsonAttributes( jsonObject : any ) : void {
        super.readJsonAttributes( jsonObject );
        if ( typeof jsonObject.isExported !== 'undefined' ) {
            this.isExported = jsonObject.isExported;
        }
    }

    /**
     * Writes the attributes of this code element out to a plain object for JSON serialization.
     */
    public writeJsonAttributes( jsonObject : any ) : void {
        super.writeJsonAttributes( jsonObject );
        jsonObject.isExported = this.isExported;
    }

    private _isExported: boolean;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A namespace is a naming structure distinguishing modules.
 */
export class Namespace
    extends AbstractNamespace
    implements INamespace
{

    /**
     * Constructs a new namespace.
     * @param parentNamespace The parent namespace containing this namespace.
     * @param uuid The unique ID of this namespace.
     * @param name The name of this namespace.
     * @param summary A short description of this namespace.
     */
    constructor(
        parentNamespace: IAbstractNamespace,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentNamespace, "Namespace", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A root package represents the nameless top level package..
 */
export class RootPackage
    extends AbstractNamespace
    implements IRootPackage
{

    /**
     * Constructs a new root package.
     * @param uuid The unique ID of this root package.
     */
    constructor( uuid : string ) {
        super( this, "RootPackage", uuid, "$", "(Top level root package)" );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function represents an executable sequence of statements. For a module, it's the 'main' function of the module.
 * For a package it's the initializer of the package. For a component it's the constructor of the component. An operation
 * is itself simply a single function.
 */
export class Function
    extends FunctionSignature
    implements IFunction
{

    /**
     * Constructs a new function signature.
     * @param parentContainer The parent component containing this function.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this function.
     * @param name The name of this function.
     * @param summary A short description of this function.
     * @param isExported Whether this function is accessible outside its container.
     */
    constructor(
        parentContainer: elements.IContainerElement,
        typeName: string,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentContainer, typeName, uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An operation is a single function signature within an interface.
 */
export class Operation
    extends FunctionSignature
    implements IOperation
{

    /**
     * Constructs a new function signature.
     * @param parentComponent The parent component containing this function.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this function.
     * @param name The name of this function.
     * @param summary A short description of this function.
     * @param isExported Whether this function is accessible outside its container.
     */
    constructor(
        parentInterface: IInterface,
        typeName: string,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentInterface, typeName, uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A method is a concrete function implementation within a component.
 */
export class Method
    extends Function
    implements IMethod
{

    /**
     * Constructs a new method.
     * @param parentComponent The parent component containing this method.
     * @param uuid The unique ID of this method.
     * @param name The name of this method.
     * @param summary A short description of this method.
     * @param isExported Whether this method is accessible outside its component.
     */
    constructor(
        parentComponent: IComponent,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentComponent, "Method", uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function signature represents the name and parameters of a function.
 */
export class Component
    extends Function
    implements IComponent
{

    /**
     * Constructs a new component.
     * @param parentContainer The parent component containing this component.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this component.
     * @param name The name of this component.
     * @param summary A short description of this component.
     * @param isExported Whether this component is accessible outside its container.
     */
    constructor(
        parentContainer: elements.IContainerElement,
        typeName: string,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentContainer, typeName, uuid, name, summary, isExported );
    }

    /**
     * Constructs a new class inside this component.
     * @param uuid The unique ID of the new class.
     * @param name The name of the new class.
     * @param summary A summary of the new class.
     * @param isExported Whether this class is exported from its containing component.
     */
    public makeClass(
        uuid: string,
        attributes: any
    ) : IClass {
        var result = new Class( this, uuid, attributes.name, attributes.summary, attributes.isExported );
        this.addChild( result );
        return result;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An abstract package collects related components.
 */
export class AbstractPackage
    extends Component
    implements IAbstractPackage
{

    /**
     * Constructs a new package.
     * @param parentContainer The parent container of this package.
     * @param typeName The name of the concrete type of this code element.
     * @param uuid The unique ID of this package.
     * @param name The name of this package.
     * @param summary A short description of this package.
     * @param isExported Whether this package is accessible outside its parent package.
     */
    constructor(
        parentContainer: elements.IContainerElement,
        typeName: string,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentContainer, typeName, uuid, name, summary, isExported );
    }

    /**
     * Constructs a new package inside this one.
     * @param uuid The unique ID of the new package.
     * @param name The name of the new package.
     * @param summary A short description of the new package.
     * @param isExported Whether the new package is accessible outside its parent package.
     */
    public makePackage(
        uuid: string,
        attributes: any
    ) : IPackage {
        var result = new Package( this, uuid, attributes.name, attributes.summary, attributes.isExported );
        this.addChild( result );
        return result;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An annotation serves as a marker for other code elements.
 */
export class Annotation
    extends Component
    implements IAnnotation
{

    /**
     * Constructs a new annotation.
     * @param parentComponent The parent component to contain this annotation.
     * @param uuid The unique ID of this annotation.
     * @param name The name of this annotation.
     * @param summary A short description of this annotation.
     * @param isExported Whether this annotation is accessible outside its parent component.
     */
    constructor(
        parentComponent: IComponent,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentComponent, "Annotation", uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A class describes a concrete component with identity, state, and behavior.
 */
export class Class
    extends Component
    implements IClass
{

    /**
     * Constructs a new class.
     * @param parentComponent The parent component to contain this class.
     * @param uuid The unique ID of this class.
     * @param name The name of this class.
     * @param summary A short description of this class.
     * @param isExported Whether this class is accessible outside its parent component.
     */
    constructor(
        parentComponent: IComponent,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentComponent, "Class", uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An enumeration of a finite set of instances.
 */
export class Enumeration
    extends Component
    implements IEnumeration
{

    /**
     * Constructs a new enumeration.
     * @param parentComponent The parent component to contain this enumeration.
     * @param uuid The unique ID of this enumeration.
     * @param name The name of this enumeration.
     * @param summary A short description of this enumeration.
     * @param isExported Whether this enumeration is accessible outside its parent component.
     */
    constructor(
        parentComponent: IComponent,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentComponent, "Enumeration", uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A module is a deployable package.
 */
export class Module
    extends AbstractPackage
    implements IModule
{

    /**
     * Constructs a new module.
     * @param parentNamespace The parent namespace containing this module.
     * @param uuid The unique ID of this module.
     * @param name The name of this module.
     * @param summary A short description of this module.
     * @param version The version number of this module.
     */
    constructor(
        parentNamespace : IAbstractNamespace,
        uuid : string,
        name : string,
        summary : string,
        version : string
    ) {
        super( parentNamespace, "Module", uuid, name, summary, true );
        this._version = version;
    }

    /**
     * Updates the attributes of this code element from the given plain (JSON-derived) object.
     * @param jsonObject Plain object with attributes to be merged into this code element.
     */
    public readJsonAttributes( jsonObject : any ) : void {
        super.readJsonAttributes( jsonObject );
        if ( typeof jsonObject.version !== 'undefined' ) {
            this.version = jsonObject.version;
        }
    }

    /**
     * The version of this module.
     */
    public get version() : string {
        return this._version;
    }
    public set version( value : string ) {
        this._version = value;
    }

    /**
     * Writes the attributes of this code element out to a plain object for JSON serialization.
     */
    public writeJsonAttributes( jsonObject : any ) : void {
        super.writeJsonAttributes( jsonObject );
        jsonObject.version = this.version;
    }

    public _version : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A package collects related components.
 */
export class Package
    extends AbstractPackage
    implements IPackage
{

    /**
     * Constructs a new package.
     * @param parentPackage The parent package containing this package.
     * @param uuid The unique ID of this package.
     * @param name The name of this package.
     * @param summary A short description of this package.
     * @param isExported Whether this package is accessible outside its parent package.
     */
    constructor(
        parentPackage: IAbstractPackage,
        uuid: string,
        name: string,
        summary: string,
        isExported: boolean
    ) {
        super( parentPackage, "Package", uuid, name, summary, isExported );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeRootPackage( uuid : string ) : IRootPackage {
    return new RootPackage( uuid );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

