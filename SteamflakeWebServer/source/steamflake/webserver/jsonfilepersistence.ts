
/**
 * Module: steamflake/webserver/persistence/jsonfilepersistence
 */

///<reference path='../../../../ThirdParty/lib/server/node.d.ts'/>

import elements = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/elements' );
import files = require( '../../../../SteamflakeCore/source/steamflake/core/io/files' );
import persistence = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/persistence' );
import promises = require( '../../../../SteamflakeCore/source/steamflake/core/concurrency/promises' );
import structure = require( '../../../../SteamflakeModel/source/steamflake/model/structure' );
import values = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/values' );

import fs = require( 'fs' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** JSON file creator implementation. */
class JsonFilePersistentStoreCreator
    implements persistence.IPersistentStoreCreator
{

    /**
     * Constructs a new JSON file creation service.
     * @param rootFolder The root folder for the repository.
     */
    constructor( rootFolder : string ) {
        this._rootFolder = rootFolder;
    }

    /**
     * Saves a newly created model element.
     * @param modelElement The just created model element to store.
     */
    public createModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {

        var result = promises.makePromise<Element>();

        // serialize
        var json : any = modelElement.toJson( elements.EJsonDetailLevel.Attributes|elements.EJsonDetailLevel.ParentIdentity );

        // code element type is the collection name
        var collectionName = json.type;

        // determine the folder
        var folder = this.determineFolder( modelElement );
        if ( folder.length === 0 ) {
            folder = this._rootFolder;
        }
        else {
            folder = this._rootFolder + folder;
        }

        var writeJson = function( value : values.ENothing ) {
            files.writeWholeFile(
                folder + "/" + modelElement.typeName + ".json",
                JSON.stringify( json, null, 2 )
            ).then (
                function( value : values.ENothing ) {
                    result.fulfill( modelElement );
                },
                function( reason : any ) {
                    result.reject( "Failed to write JSON file. " + reason );
                }
            );
        };

        files.establishFolder( folder ).then( writeJson );

        return result;
    }

    private determineFolder(
        modelElement : elements.IModelElement
    ) {

        if ( modelElement.typeName === "RootPackage" ) {
            return "";
        }

        var result = this.determineFolder( modelElement.parentContainer );
        result += "/";
        result += modelElement.path;

        return result;
    }

    /** The root of the folder structure to read and write. */
    private _rootFolder : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** JSON file reader. */
class JsonFilePersistentStoreReader
    implements persistence.IPersistentStoreReader<structure.IRootPackage>
{

    /**
     * Constructs a new JSON file reader service.
     * @param rootFolder The root folder for the repository.
     */
    constructor( rootFolder : string ) {
        this._rootFolder = rootFolder;
    }

    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
        ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
    }

    public loadRootModelElement() : promises.IPromise<structure.IRootPackage> {

        var result = promises.makePromise<structure.IRootPackage>();

        // TBD

        return result;

    }

    /** The root of the folder structure to read and write. */
    private _rootFolder : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** JSON file updater. */
class JsonFilePersistentStoreUpdater
    implements persistence.IPersistentStoreUpdater
{

    /**
     * Constructs a new JSON file update service.
     * @param rootFolder The root folder for the repository.
     */
    constructor( rootFolder : string ) {
        this._rootFolder = rootFolder;
    }

    public updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : persistence.IPersistentStoreUpdaterOptions
        ) : promises.IPromise<Element> {

        var result = promises.makePromise<Element>();

        // TBD

        return result;
    }

    /** The root of the folder structure to read and write. */
    private _rootFolder : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** JSON file deleter. */
class JsonFilePersistentStoreDeleter
    implements persistence.IPersistentStoreDeleter
{

    /**
     * Constructs a new MongoDB deletion service.
     * @param rootFolder The root folder for the repository.
     */
    constructor( rootFolder : string ) {
        this._rootFolder = rootFolder;
    }

    public deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {

        var result = promises.makePromise<Element>();

        // code element type is the collection name
        var collectionName = modelElement.typeName;

        // TBD

        return result;
    }

    /** The root of the folder structure to read and write. */
    private _rootFolder : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** JSON file persistent store. */
class JsonFilePersistentStore
    implements persistence.IPersistentStore<structure.IRootPackage>
{

    /**
     * Constructs a new MongoDB persistent store.
     * @param rootFolder The root folder for the repository.
     */
    constructor( rootFolder : string ) {
        this._creator = new JsonFilePersistentStoreCreator( rootFolder );
        this._deleter = new JsonFilePersistentStoreDeleter( rootFolder );
        this._reader = new JsonFilePersistentStoreReader( rootFolder );
        this._updater = new JsonFilePersistentStoreUpdater( rootFolder );
    }

    /**
     * The creator service associated with this persistent store.
     */
    public get creator() {
        return this._creator;
    }

    /**
     * The deleter service associated with this persistent store.
     */
    public get deleter() {
        return this._deleter;
    }

    /**
     * The reader service associated with this store.
     */
    public get reader() {
        return this._reader;
    }

    /**
     * The updater service associated with this store.
     */
    public get updater() {
        return this._updater;
    }

    /** Creator service. */
    private _creator : JsonFilePersistentStoreCreator;

    /** Deleter service. */
    private _deleter : JsonFilePersistentStoreDeleter;

    /** Reader service. */
    private _reader : JsonFilePersistentStoreReader;

    /** Updater service. */
    private _updater : JsonFilePersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a JSON file-backed persistent store.
 * @param rootFolder The root folder for JSON file storage.
 * @returns the newly created store
 */
export function makeJsonFilePersistentStore(
    rootFolder : string
) : persistence.IPersistentStore<structure.IRootPackage> {
    return new JsonFilePersistentStore( rootFolder );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


