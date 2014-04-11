
/**
 * Module: steamflake/webserver/persistence/mongodbpersistence
 */

/// <reference path='../../../../ThirdParty/lib/server/mongodb.d.ts' />

import elements = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/elements' );
import persistence = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/persistence' );
import promises = require( '../../../../SteamflakeCore/source/steamflake/core/concurrency/promises' );

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
        dropCollections : boolean,
        loadSampleData : boolean
    ) : promises.IPromise<boolean>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB creator implementation. */
class MongoDbPersistentStoreCreator
    implements persistence.IPersistentStoreCreator
{

    public createModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
        return promises.makeImmediatelyFulfilledPromise( modelElement );
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB reader. */
class MongoDbPersistentStoreReader<RootElement extends elements.IRootContainerElement>
    implements persistence.IPersistentStoreReader<RootElement>
{

    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
    }

    public loadRootModelElement() : promises.IPromise<RootElement> {
        throw Error( "TBD - not yet implemented" );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB updater. */
class MongoDbPersistentStoreUpdater
    implements persistence.IPersistentStoreUpdater
{

    public updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
        return promises.makeImmediatelyFulfilledPromise( modelElement );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** MongoDB deleter. */
class MongoDbPersistentStoreDeleter
    implements persistence.IPersistentStoreDeleter
{

    public deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "TBD - not yet implemented" );
        return promises.makeImmediatelyFulfilledPromise( modelElement );
    }

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

    constructor() {
        this._creator = new MongoDbPersistentStoreCreator();
        this._deleter = new MongoDbPersistentStoreDeleter();
        this._reader = new MongoDbPersistentStoreReader<RootElement>();
        this._updater = new MongoDbPersistentStoreUpdater();
    }

    public get creator() {
        return this._creator;
    }

    public get deleter() {
        return this._deleter;
    }

    /**
     * Establishes the connection to MongoDB.
     * @param initializeSchema Whether to drop and recreate the tables.
     * @param loadSampleData Whether to load some sample data for testing.
     */
    public connect(
        dropCollections : boolean,
        loadSampleData : boolean
    ) : promises.IPromise<boolean> {
        var self = this;

        var result = promises.makePromise();

        // connect to the database
        mongodb.MongoClient.connect( "mongodb://localhost:27017/steamflake", function(err:any, db:mongodb.Db) {
            if ( err ) {
                console.log( "FAILED TO CONNECT: ", err );
                result.reject( "Failed to connect. " + err );
                return;
            }

            // link to the database
//            self.db = db;

            // create the CRUD services
//            self._creator = new MongoDbCreator( db );
//            self._reader = new MongoDbReader( db );
//            self._updater = new MongoDbUpdater( db );
//            self._deleter = new MongoDbDeleter( db );

            var schema = new MongoDbSchemaInitializer( db );

            if ( dropCollections ) {
                console.log( "DROPPING COLLECTIONS ... " );
                schema.dropCollections().then(
                    function( dropped : boolean ) {
                        console.log( "ESTABLISHING COLLECTIONS ... " );
                        schema.establishCollections().then(
                            function( established : boolean ) {
//                                 self.loadSampleData( function() {
                                       self._dbInitialized = true;
                                       result.fulfill( true );
//                                 } );
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

    public get reader() {
        return this._reader;
    }

    public get updater() {
        return this._updater;
    }

    /** Flag set when MongoDB is ready for queries. */
    private _dbInitialized : boolean = false;

    private _creator : MongoDbPersistentStoreCreator;

    private _deleter : MongoDbPersistentStoreDeleter;

    private _reader : MongoDbPersistentStoreReader<RootElement>;

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


