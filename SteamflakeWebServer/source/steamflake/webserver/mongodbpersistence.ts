
/**
 * Module: steamflake/webserver/persistence/mongodbpersistence
 */

/// <reference path='../../../../ThirdParty/lib/server/mongodb.d.ts' />

import elements = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/elements' );
import persistence = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/persistence' );
import promises = require( '../../../../SteamflakeCore/source/steamflake/core/concurrency/promises' );
import structure = require( '../../../../SteamflakeModel/source/steamflake/model/structure' );

import mongodb = require( 'mongodb' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a MongoDB persistent store.
 */
export interface IMongoDbPersistenceStore<RootElement extends elements.IRootContainerElement>
    extends persistence.IPersistentStore<RootElement> {

    /**
     * Establishes the connection to MongoDB.
     * @param dropCollections Whether to drop and recreate the tables.
     * @param loadSampleData Whether to load some sample data for testing.
     */
    connect(
        dropCollections? : boolean,
        loadSampleData? : boolean
    ) : promises.IPromise<boolean>;

    /**
     * Disconnects from MongoDB.
     */
    disconnect();

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB creator implementation. */
class MongoDbPersistentStoreCreator
    implements persistence.IPersistentStoreCreator
{

    /**
     * Constructs a new MongoDB creation service.
     * @param db The encapsulated MongoDB instance.
     */
    constructor( db : mongodb.Db ) {
        this._db = db;
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

        // MondoDB uses _id instead of uuid
        json._id = json.uuid;
        delete json.uuid;

        // code element type is the collection name
        var collectionName = json.type;
        delete json.type;

        // need just the parent ID
        json.parent_id = json.parentContainer.uuid;
        delete json.parentContainer;

        // complete the insert
        this._db.collection(
            collectionName,
            function( err : any, collection : mongodb.Collection ) {
                if ( err ) {
                    result.reject( "Failed to open collection " + collectionName + ". " + err );
                    return;
                }

                collection.insert(
                    json,
                    function ( err : any, inserted ) {
                        if ( err ) {
                            result.reject( "Failed to insert model element. " + err );
                            return;
                        }

                        result.fulfill( modelElement );
                    }
                );
            }
        );

        return result;
    }

    /** The encapsulated database instance. */
    private _db : mongodb.Db;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB reader. */
class MongoDbPersistentStoreReader<RootElement extends elements.IRootContainerElement>
    implements persistence.IPersistentStoreReader<RootElement>
{

    /**
     * Constructs a new MongoDB reader service.
     * @param db The encapsulated MongoDB instance.
     */
    constructor( db : mongodb.Db ) {
        this._db = db;
    }

    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
    }

    public loadRootModelElement() : promises.IPromise<RootElement> {
        throw Error( "TBD - not yet implemented" );
    }

    /** The encapsulated database instance. */
    private _db : mongodb.Db;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB updater. */
class MongoDbPersistentStoreUpdater
    implements persistence.IPersistentStoreUpdater
{

    /**
     * Constructs a new MongoDB update service.
     * @param db The encapsulated MongoDB instance.
     */
    constructor( db : mongodb.Db ) {
        this._db = db;
    }

    public updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : persistence.IPersistentStoreUpdaterOptions
    ) : promises.IPromise<Element> {

        var result = promises.makePromise<Element>();

        var changes = modelElement.acceptVisitor( this, "determineChangesIn", options.changedAttributeNames );

        this._db.collection( modelElement.typeName, function( err, collection ) {
            collection.update(
                { _id: modelElement.uuid },
                { $set: changes },
                function( err, result ) {
                    if ( err ) {
                        result.reject( "Failed to update model element. " + err );
                        return;
                    }

                    result.fulfill( modelElement );
                }
            );
        } );

        return result;
    }

    /**
     * Builds the changes needed to make an update to the database for a changed class.
     * @param cclass The class to keep up to date.
     */
    public determineChangesInClass( cclass : structure.IClass, changedAttributeNames : string[ ] ) {
        return this.determineChangesInComponent( cclass, changedAttributeNames );
    }

    /**
     * Builds the changes needed to make an update to the database for a changed module.
     * @param mmodule The module to keep up to date.
     */
    public determineChangesInModule( mmodule : structure.IModule, changedAttributeNames : string[ ] ) : any {
        var result : any = this.determineChangesInAbstractPackage( mmodule, changedAttributeNames );

        if ( changedAttributeNames.indexOf( "version" ) >= 0 ) {
            result.version = mmodule.version;
        }

        return result;
    }

    /**
     * Registers a listener to make updates to the database when a namespace changes.
     * @param namespace The namespace to keep up to date.
     */
    public determineChangesInNamespace( namespace : structure.INamespace, changedAttributeNames : string[ ] ) {
        return this.determineChangesInAbstractNamespace( namespace, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when a package changes.
     * @param ppackage The package to keep up to date.
     */
    public determineChangesInPackage( ppackage : structure.IPackage, changedAttributeNames : string[ ] ) {
        return this.determineChangesInAbstractPackage( ppackage, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when the root package changes.
     * @param rootPackage The root package to keep up to date.
     */
    public determineChangesInRootPackage( rootPackage : structure.IRootPackage, changedAttributeNames : string[ ] ) {
        // changes to root package are ignored; invalid really
        return {};
    }

    /**
     * Registers a listener to make updates to the database when an abstract namespace changes.
     * @param namespace The abstract namespace to keep up to date.
     */
    private determineChangesInAbstractNamespace( namespace : structure.IAbstractNamespace, changedAttributeNames : string[ ] ) {
        return this.determineChangesInNamedContainerElement( namespace, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when an abstract package changes.
     * @param ppackage The abstract package to keep up to date.
     */
    private determineChangesInAbstractPackage( ppackage : structure.IAbstractPackage, changedAttributeNames : string[ ] ) {
        return this.determineChangesInComponent( ppackage, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The code element to keep up to date.
     */
    private determineChangesInModelElement( modelElement : elements.IModelElement, changedAttributeNames : string[ ] ) {
        var result : any = {};

        if ( changedAttributeNames.indexOf( "summary" ) >= 0 ) {
            result.summary = modelElement.summary;
        }

        return result;
    }

    /**
     * Registers a listener to make updates to the database when a component changes.
     * @param component The component to keep up to date.
     */
    private determineChangesInComponent( component : structure.IComponent, changedAttributeNames : string[ ] ) {
        return this.determineChangesInFunction( component, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when a container changes.
     * @param container The container to keep up to date.
     */
    private determineChangesInContainerElement( container : elements.IContainerElement, changedAttributeNames : string[ ] ) {
        return this.determineChangesInModelElement( container, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when a function changes.
     * @param ffunction The function to keep up to date.
     */
    private determineChangesInFunction( ffunction : structure.IFunction, changedAttributeNames : string[ ] ) {
        return this.determineChangesInFunctionSignature( ffunction, changedAttributeNames );
    }

    /**
     * Registers a listener to make updates to the database when a function changes.
     * @param functionSignature The function to keep up to date.
     */
    private determineChangesInFunctionSignature( functionSignature : structure.IFunctionSignature, changedAttributeNames : string[ ] ) {
        var result : any = this.determineChangesInNamedContainerElement( functionSignature, changedAttributeNames );

        if ( changedAttributeNames.indexOf( "isExported" ) >= 0 ) {
            result.isExported = functionSignature.isExported;
        }

        return result;
    }

    /**
     * Registers a listener to make updates to the database when a container changes.
     * @param namedContainer The container to keep up to date.
     */
    private determineChangesInNamedContainerElement( namedContainer : elements.INamedContainerElement, changedAttributeNames : string[ ] ) {
        var result : any = this.determineChangesInContainerElement( namedContainer, changedAttributeNames );

        if ( changedAttributeNames.indexOf( "name" ) >=0 ) {
            result.name = namedContainer.name;
        }

        return result;
    }

    /**
     * Registers a listener to make updates to the database when a named element changes.
     * @param namedElement The named element to keep up to date.
     */
    private determineChangesInNamedElement( namedElement : elements.INamedElement, changedAttributeNames : string[ ] ) {
        var result : any = this.determineChangesInModelElement( namedElement, changedAttributeNames );

        if ( changedAttributeNames.indexOf( "name" ) >=0 ) {
            result.name = namedElement.name;
        }

        return result;
    }

    /** The encapsulated database instance. */
    private _db : mongodb.Db;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB deleter. */
class MongoDbPersistentStoreDeleter
    implements persistence.IPersistentStoreDeleter
{

    /**
     * Constructs a new MongoDB deletion service.
     * @param db The encapsulated MongoDB instance.
     */
    constructor( db : mongodb.Db ) {
        this._db = db;
    }

    public deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {

        var result = promises.makePromise<Element>();

        // code element type is the collection name
        var collectionName = modelElement.typeName;

        this._db.collection(
            collectionName,
            function( err, collection : mongodb.Collection ) {
                if ( err ) {
                    result.reject( "Failed to open collection " + collectionName + ". " + err );
                    return;
                }

                collection.remove(
                    { _id: modelElement.uuid },
                    function ( err, inserted ) {
                        if ( err ) {
                            result.reject( "Failed to delete model element. " + err );
                            return;
                        }

                        result.fulfill( modelElement );
                    }
                );
            }
        );

        return result;
    }

    /** The encapsulated database instance. */
    private _db : mongodb.Db;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Utility service establishes the collections and indexes needed for a MongoDB Steamflake repository.
 */
class MongoDbSchemaInitializer {

    /**
     * Constructs a new utility to ensure the Steamflake schema is in place.
     * @param db The MongoDB connection to read from.
     */
    constructor(
        db : mongodb.Db
    ) {
        this._db = db;
    }

    /**
     * Drops all the collections used for Steamflake metadata in MongoDB.
     * @param callback Called when schema is empty.
     */
    public dropCollections() : promises.IPromise<boolean> {

        var result = promises.makePromise<boolean>();

        var count = this._namedElementCollections.length + this._unnamedElementCollections.length;

        var countDownCollections = function( dropped : boolean ) {
            count -= 1;
            if ( count === 0 ) {
                result.fulfill( true );
            }
        }

        for ( var i=0 ; i<this._namedElementCollections.length ; i+=1 ) {
            this.dropCollection( this._namedElementCollections[i] ).then( countDownCollections );
        }

        for ( var i=0 ; i<this._unnamedElementCollections.length ; i+=1 ) {
            this.dropCollection( this._unnamedElementCollections[i] ).then( countDownCollections );
        }

        return result;
    }

    /**
     * Establishes the collections needed for Steamflake metadata in MongoDB.
     * @param callback Called when schema is ready.
     */
    public establishCollections() : promises.IPromise<boolean> {

        var result = promises.makePromise<boolean>();

        var count = this._namedElementCollections.length + this._unnamedElementCollections.length;

        var countDownCollections = function( established : boolean ) {
            count -= 1;
            if ( count === 0 ) {
                result.fulfill( true );
            }
        }

        for ( var i=0 ; i<this._namedElementCollections.length ; i+=1 ) {
            this.establishCollection( this._namedElementCollections[i], true ).then( countDownCollections );
        }

        for ( var i=0 ; i<this._unnamedElementCollections.length ; i+=1 ) {
            this.establishCollection( this._unnamedElementCollections[i], false ).then( countDownCollections );
        }

        return result;
    }

    /**
     * Drops a given collection.
     * @param collectionName The name of the collection to drop.
     */
    private dropCollection( collectionName : string ) : promises.IPromise<boolean> {

        var result = promises.makePromise<boolean>();

        var self = this;

        self._db.dropCollection( collectionName, function( err ) {
            if ( err ) {
                result.reject( "Failed to drop collection: " + collectionName + ". " + err );
                // TBD: distinguish missing collection from something worse
            }
            else {
                result.fulfill( true );
            }
        } );

        return result;
    }

    /**
     * Establishes one collection
     * @param collectionName The name of the collection (same as code element name).
     * @param named Whether the collection needs and index for its "name" attribute.
     * @param callback Callback function called when done.
     */
    private establishCollection( collectionName : string, named : boolean ) : promises.IPromise<boolean> {

        var result = promises.makePromise<boolean>();

        var self = this;

        self._db.collection( collectionName, function( err, collection ) {
            if ( err ) {
                result.reject( "Failed to create collection: " + collectionName +". " + err );
                return;
            }

            // index by parent UUID
            collection.ensureIndex(
                { parent_id:1 },
                { unique:false, background:true, w:1 },
                function( err, indexName ) {
                    if ( err ) {
                        result.reject( "Failed to create index: " + collectionName + ". " + err );
                        return;
                    }
                }
            );

            // index by name
            if ( named ) {
                collection.ensureIndex(
                    { parent_id:1, name:1 },
                    { unique:false, background:true, w:1 },
                    function( err, indexName ) {
                        if ( err ) {
                            result.reject( "Failed to create name index: " + collectionName + ". " + err );
                            return;
                        }
                    }
                );
            }

            result.fulfill( true );
        } );

        return result;
    }

    private _db : mongodb.Db;

    private/*static*/ _namedElementCollections = [ "Class", "Module", "Namespace", "Package", "RootPackage" ];

    private/*static*/ _unnamedElementCollections = [ ];

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB persistent store. */
class MongoDbPersistentStore<RootElement extends elements.IRootContainerElement>
    implements IMongoDbPersistenceStore<RootElement>
{

    /**
     * Constructs a new MongoDB persistent store.
     * TBD: configurable externally
     */
    constructor() {
        this._dbUri = "mongodb://localhost:27017/steamflake";
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
     * Establishes the connection to MongoDB. Nothing will be ready for use until the returned promise is fulfilled.
     * @param initializeSchema Whether to drop and recreate the tables.
     * @param loadSampleData Whether to load some sample data for testing.
     */
    public connect(
        dropCollections : boolean = false,
        loadSampleData : boolean = false
    ) : promises.IPromise<boolean> {
        var self = this;

        var result = promises.makePromise<boolean>();

        // connect to the database
        mongodb.MongoClient.connect( self._dbUri, function(err:any, db:mongodb.Db) {
            if ( err ) {
                console.log( "FAILED TO CONNECT: ", err );
                result.reject( "Failed to connect. " + err );
                return;
            }

            // link to the database
            self._db = db;

            var schema = new MongoDbSchemaInitializer( db );

            if ( dropCollections ) {
                schema.dropCollections().then(
                    function( dropped : boolean ) {
                        schema.establishCollections().then(
                            function( established : boolean ) {
//                              self.loadSampleData( function() {

                                    // create the CRUD services
                                    self._creator = new MongoDbPersistentStoreCreator( db );
                                    self._reader = new MongoDbPersistentStoreReader<RootElement>( db );
                                    self._updater = new MongoDbPersistentStoreUpdater( db );
                                    self._deleter = new MongoDbPersistentStoreDeleter( db );

                                    self._dbInitialized = true;
                                    result.fulfill( true );
//                              } );
                            }
                        );
                    }
                );
            }
            else {
                schema.establishCollections().then(
                    function( established : boolean ) {
                        self._dbInitialized = true;
                        result.fulfill( true );
                    }
                );
            }

        } );

        return result;
    }

    /**
     * Disconnects from MongoDB.
     */
    public disconnect() {
        var self = this;

        var result = promises.makePromise<boolean>();

        this._db.close( true, function(err:Error,unused:any){
            if ( err ) {
                result.reject( "Failed to disconnect. " + err );
            }
            else {
                result.fulfill( true );
            }
        } );

        return result;
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

    /** The encapsulated database instance. */
    private _db : mongodb.Db;

    /** Flag set when MongoDB is ready for queries. */
    private _dbInitialized : boolean = false;

    /** The URI for the database connection. */
    private _dbUri : string;

    /** Creator service. */
    private _creator : MongoDbPersistentStoreCreator;

    /** Deleter service. */
    private _deleter : MongoDbPersistentStoreDeleter;

    /** Reader service. */
    private _reader : MongoDbPersistentStoreReader<RootElement>;

    /** Updater service. */
    private _updater : MongoDbPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a MongoDB-backed persistent store.
 * @returns the newly created store
 */
export function makeMongoDbPersistentStore<RootElement extends elements.IRootContainerElement>() : IMongoDbPersistenceStore<RootElement> {
    return new MongoDbPersistentStore<RootElement>();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


