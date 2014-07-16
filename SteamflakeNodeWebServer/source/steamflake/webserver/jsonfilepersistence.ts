
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

/**
 * Helper class determines the folder and file names for model elements.
 */
class JsonFileFolderHierarchy {

    /**
     * Constructs a new file hierarchy service.
     * @param rootFolderStr The root folder of the repository.
     */
    constructor( rootFolderStr : string ) {
        this._rootFolder = files.makePath( rootFolderStr );
    }

    /**
     * Determines the file for a given model element.
     * @param modelElement The model element to be read or written.
     * @return {*} The name of the file for the model element.
     */
    public determineFilePath(
        modelElement : elements.IModelElement
    ) : files.IPath {
        return files.makePath( modelElement.typeName + ".json" );
    }

    /**
     * Determines the folder of a given model element.
     * @param modelElement The model element to be read or written.
     * @return {*} The ful path of the folder for the model element.
     */
    public determineFolderPath(
        modelElement : elements.IModelElement
    ) : files.IPath {

        if ( modelElement.typeName === "RootPackage" ) {
            return this._rootFolder;
        }

        var result = this.determineFolderPath( modelElement.parentContainer );

        return result.append( files.makePath( modelElement.path ) );
    }

    /**
     * Determines the file for the root package.
     * @return {*} The name of the file for the root package.
     */
    public determineRootPackageFilePath() : files.IPath {
        return files.makePath( "RootPackage.json" );
    }

    /**
     * Determines the folder of the root package.
     * @return {*} The full path of the folder for the root package.
     */
    public determineRootPackageFolderPath() : files.IPath {
        return this._rootFolder;
    }

    /** The root of the folder structure to read and write. */
    private _rootFolder : files.IPath;

}

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
        this._folderHierarchy = new JsonFileFolderHierarchy( rootFolder );
    }

    /**
     * Saves a newly created model element.
     * @param modelElement The just created model element to store.
     */
    public createModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {

        // serialize
        var json : any = modelElement.toJson( elements.EJsonDetailLevel.Attributes|elements.EJsonDetailLevel.ParentIdentity );
        var jsonStr = JSON.stringify( json, null, 2 );

        // determine the folder
        var folderPath = this._folderHierarchy.determineFolderPath( modelElement );
        var filePath = folderPath.append( this._folderHierarchy.determineFilePath( modelElement ) );

        // function that writes the JSON output
        var writeJson = function( file : files.IFileResource ) {
            if ( file.isNonexistent ) {
                return (<files.INonexistentFileResource> file).establishFile( jsonStr );
            }
            if ( file.isFile ) {
                return (<files.IFile> file).writeWholeContents( jsonStr );
            }

            throw new Error( "Not a file: " + filePath.asString );
        };

        // function that passes back the created model element
        var returnModelElement = function( file : files.IFile ) {
            return modelElement;
        };

        return filePath.findResource().then_p( writeJson ).then( returnModelElement );

    }

    /** The logic for determining folder and file names. */
    private _folderHierarchy : JsonFileFolderHierarchy;

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
        this._folderHierarchy = new JsonFileFolderHierarchy( rootFolder );
    }

    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
    }

    public loadRootModelElement() : promises.IPromise<structure.IRootPackage> {

        // determine the folder
        var folderPath = this._folderHierarchy.determineRootPackageFolderPath();
        var filePath = folderPath.append( this._folderHierarchy.determineRootPackageFilePath() );

        // function that reads a whole file
        var readWholeFile = function( file : files.IFileResource ) {
            if ( !file.isFile ) {
                throw new Error( "Not a file: " + filePath.asString );
            }

            return (<files.IFile> file).readWholeContents();
        };

        // function that parses the JSON in a file
        var parseJson = function( jsonStr : string ) {
            var json = JSON.parse( jsonStr );
            return structure.makeRootPackage( json.uuid );
        };

        return filePath.findResource().then_p( readWholeFile ).then( parseJson );

    }

    /** The logic for determining folder and file names. */
    private _folderHierarchy : JsonFileFolderHierarchy;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** JSON file updater. */
class JsonFilePersistentStoreUpdater
    implements persistence.IPersistentStoreUpdater
{

    /**
     * Constructs a new JSON file update service.
     * @param creator The creator for the store (updates implemented as creates).
     */
    constructor( creator : persistence.IPersistentStoreCreator ) {
        this._creator = creator;
    }

    /**
     * Saves a changed model element.
     * @param modelElement The changed model element to save persistently.
     * @param options The attributes that have changed.
     */
    public updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : persistence.IPersistentStoreUpdaterOptions
    ) : promises.IPromise<Element> {

        // update by overwriting
        return this._creator.createModelElement( modelElement );

    }

    /** The logic for determining folder and file names. */
    private _creator : persistence.IPersistentStoreCreator;

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
        this._folderHierarchy = new JsonFileFolderHierarchy( rootFolder );
    }

    public deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {

        // determine the folder
        var folderPath = this._folderHierarchy.determineFolderPath( modelElement );

        // function that removes a folder
        var removeFolder = function( folder : files.IFileResource ) {
            return folder.remove();
        };

        // function that passes back the deleted model element
        var returnModelElement = function( folder : files.IFileResource ) {
            return modelElement;
        };

        // delete it recursively
        return folderPath.findResource().then_p( removeFolder ).then( returnModelElement );

    }

    /** The logic for determining folder and file names. */
    private _folderHierarchy : JsonFileFolderHierarchy;

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
        this._updater = new JsonFilePersistentStoreUpdater( this._creator );
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


