
/**
 * Module: lzero/webserver/lzerowebserver
 */

///<reference path='../../../../ThirdParty/lib/server/node.d.ts'/>
///<reference path='../../../../ThirdParty/lib/server/restify.d.ts'/>

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var bunyan = require( 'bunyan' );
var nstatic = require( 'node-static' );

import restify = require( 'restify' );

import elements = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/elements' );
import jsonfilepersistence = require( '../../../source/steamflake/webserver/jsonfilepersistence' );
import persistence = require( '../../../../SteamflakeCore/source/steamflake/core/metamodel/persistence' );
import structure = require( '../../../../SteamflakeModel/source/steamflake/model/structure' );
import uuids = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/uuids' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to the Steamflake application web server.
 */
export interface ISteamflakeWebServer {

    /**
     * Configures and starts the web server.
     */
    serve() : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Implementation of the Steamflake application server.
 */
class SteamflakeWebServer
    implements ISteamflakeWebServer
{

    /**
     * Configures and starts the web server.
     */
    public serve() {

        var me = this;

        // set up persistence store
        me._store = jsonfilepersistence.makeJsonFilePersistentStore( SteamflakeWebServer.WORKSPACE_PATH + "/tmp/model" );

        // create an initial model
        me.buildModel();

        // Restify server name
        var serverName = "SteamflakeWebServer";

        // Logger
        me._logger = bunyan.createLogger( {
            name: serverName,
            streams: [
                {
                    level: 'info',
                    path: 'logs/' + serverName + '.log'
                }
            ]
        } );

        // Create the Restify server
        me._server = restify.createServer( {
            name: serverName,
            log: me._logger
        } );

        // set up static content
        me.serveStaticContent();

        // root packages
        me.serveRootPackage();

        // Establish request logging
        me.audit();

        // Start the server
        me.listen();

    }

    /**
     * Sets up HTTP request audit logging.
     */
    private audit() {
        this._server.on( 'after', restify.auditLogger({
            log: this._logger
        }));
    }

    /**
     * Creates a sample model for experimentation.
     */
    private buildModel() {
        var rootPackage = structure.makeRootPackage( uuids.makeUuid() );
         var steamflakeNamespace = rootPackage.makeNamespace( uuids.makeUuid(), {name:"steamflake", summary:"Steamflake"} );
          var languageNamespace = steamflakeNamespace.makeNamespace( uuids.makeUuid(), {name:"language", summary:"Steamflake Language"} );
           var metamodelNamespace = languageNamespace.makeNamespace( uuids.makeUuid(), {name:"metamodel", summary:"Steamflake Language Metamodel"} );
            var commandsModule = metamodelNamespace.makeModule( uuids.makeUuid(), {name:"commands", summary:"L-Zero Language Metamodel Commands", version:"0.1"} );

//        var foundationcommandsPackage = commandsModule.addPackage( uuids.makeUuid(), {name:"foundationcommands", summary:"L-Zero Language Metamodel Foundation Commands", isExported:true} );
//        var structurecommandsPackage = commandsModule.addPackage( uuids.makeUuid(), {name:"structurecommands", summary:"L-Zero Language Metamodel Structure Commands", isExported:true} );
//        var elementsModule = metamodelNamespace.addModule( uuids.makeUuid(), {name:"elements", summary:"L-Zero Language Metamodel Elements", version:"0.1"} );
//        var foundationPackage = elementsModule.addPackage( uuids.makeUuid(), {name:"foundation", summary:"L-Zero Language Metamodel Foundation Elements", isExported:true} );
//        var codeElementClass = foundationPackage.addClass( uuids.makeUuid(), {name:"CodeElement", summary:"Top-level code element", isExported:true} );
//        var structurePackage = elementsModule.addPackage( uuids.makeUuid(), {name:"structure", summary:"L-Zero Language Metamodel Structure Elements", isExported:true} );
//        var persistenceModule = metamodelNamespace.addModule( uuids.makeUuid(), {name:"persistence", summary:"L-Zero Language Metamodel Persistence", version:"0.1"} );
//        var servicesModule = metamodelNamespace.addModule( uuids.makeUuid(), {name:"services", summary:"L-Zero Language Metamodel Services", version:"0.1"} );
//        var collectionsNamespace = languageNamespace.addNamespace( uuids.makeUuid(), {name:"collections", summary:"L-Zero Language Collections"} );
//        var utilitiesNamespace = steamflakeNamespace.makeNamespace( uuids.makeUuid(), {name:"utilities", summary:"L-Zero Utilities"} );
//        var concurrencyModule = utilitiesNamespace.addModule( uuids.makeUuid(), {name:"concurrency", summary:"Concurrency", version:"0.1"} );
//        var tasksPackage = concurrencyModule.addPackage( uuids.makeUuid(), {name:"tasks", summary:"Concurrent Task Utilities", isExported:true} );
//        var tasksimplementationPackage = tasksPackage.addPackage( uuids.makeUuid(), {name:"tasksimplementation", summary:"Concurrent Task Utilities Implementation", isExported:false} );
//        var synchronizationPackage = concurrencyModule.addPackage( uuids.makeUuid(), {name:"synchronization", summary:"Concurrent Task Synchronization Utilities", isExported:true} );
//        var regularexpressionsModule = utilitiesNamespace.addModule( uuids.makeUuid(), {name:"regularexpressions", summary:"Regular Expressions", version:"0.1"} );

        this._store.creator.createModelElement( rootPackage )
            .then_p( function( modelElement : elements.IModelElement ) { console.log( 'steamflake' ); return this._store.creator.createModelElement( steamflakeNamespace ); } )
            .then_p( function( modelElement : elements.IModelElement ) { console.log( 'language' ); return this._store.creator.createModelElement( languageNamespace ); } )
            .then_p( function( modelElement : elements.IModelElement ) { console.log( 'metamodel' ); return this._store.creator.createModelElement( metamodelNamespace ); } )
            .then_p( function( modelElement : elements.IModelElement ) { console.log( 'commands' ); return this._store.creator.createModelElement( commandsModule ); } );
    }

    /**
     * Starts the server listening.
     */
    private listen() {
        var me = this;

        me._server.listen( 8080, function() {
            console.log( 'Server started: %s listening at %s.', me._server.name, me._server.url );
            me._logger.info( 'Server started: %s listening at %s.', me._server.name, me._server.url );
        });
    }

    /**
     * Serves JSON for the root package.
     */
    private serveRootPackage() {

        var me = this;

        // RootPackage response
        me._server.get(
            '/Steamflake/RootPackage',
            function respond( req: restify.Request, res: restify.Response, next: Function ) {

                var load = function() {
                    return me._store.reader.loadRootModelElement();
                };

                var returnJson = function( modelElement : structure.IRootPackage ) {
                    res.json( modelElement.toJson( elements.EJsonDetailLevel.Attributes ) );
                    next();
                };

                load().then( returnJson );
            }
        );


    }

    /**
     * Sets up the server to serve static content.
     * @param server The server under construction.
     */
    private serveStaticContent() {

        // Static file server
        var file = new nstatic.Server( SteamflakeWebServer.WORKSPACE_PATH );

        // Serve simple static web files;
        // NOTE: Main page = http://localhost:8080/Steamflake/SteamflakeWebClient/index.html
        // TBD: Secure non-production resources
        this._server.get( /^\/Steamflake\/.*\.(html|js|css|png|eot|svg|ttf|woff)/, function( req, res, next ) {
            file.serve( req, res, function ( err ) {
                if ( err ) {
                    throw err;
                }
                next();
            } );
        } );

    }

    /** Bunyan logger */
    private _logger : any/*TBD: need .d.ts for bunyan*/;

    /** The HTTP server. */
    private _server : restify.Server;

    /** The persistent store for Steamflake model elements. */
    private _store : persistence.IPersistentStore<structure.IRootPackage>;

    // File system configuration. TBD:  Make configurable.
    private static WORKSPACE_PATH = '/home/mnordberg/workspace';

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new Steamflake web server.
 */
export function makeSteamflakeWebServer() : ISteamflakeWebServer {
    return new SteamflakeWebServer();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
