
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
        var rootElement = structure.makeRootPackage( uuids.makeUuid() );

        this._store.creator.createModelElement( rootElement );
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
