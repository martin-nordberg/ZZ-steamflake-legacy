
/**
 * Module: lzero/webserver/lzerowebserver
 */

///<reference path='../../../../ThirdParty/lib/server/node.d.ts'/>
///<reference path='../../../../ThirdParty/lib/server/restify.d.ts'/>

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var bunyan = require( 'bunyan' );
var nstatic = require( 'node-static' );

import restify = require( 'restify' );

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

        // Restify server name
        var serverName = "SteamflakeWebServer";

        // Logger
        var logger = bunyan.createLogger( {
            name: serverName,
            streams: [
                {
                    level: 'info',
                    path: 'logs/' + serverName + '.log'
                }
            ]
        } );

        // Create the Restify server
        var server = restify.createServer( {
            name: serverName,
            log: logger
        } );

        // set up static content
        this.serveStaticContent( server );

        // Establish request logging
        server.on( 'after', restify.auditLogger({
            log: logger
        }));

        // Start the server
        server.listen( 8080, function() {
            console.log('Server started: %s listening at %s.', server.name, server.url);
            logger.info('Server started: %s listening at %s.', server.name, server.url);
        });

    }

    /**
     * Sets up the server to serve static content.
     * @param server The server under construction.
     */
    private serveStaticContent( server : restify.Server ) {

        // Static file server
        var file = new nstatic.Server( this.WORKSPACE_PATH );

        // Serve simple static web files;
        // NOTE: Main page = http://localhost:8080/Steamflake/SteamflakeWebClient/index.html
        // TBD: Secure non-production resources
        server.get( /^\/Steamflake\/.*\.(html|js|css|png|eot|svg|ttf|woff)/, function( req, res, next ) {
            file.serve( req, res, function ( err ) {
                if ( err ) {
                    throw err;
                }
                next();
            } );
        } );

    }

    // File system configuration. TBD:  Make configurable.
    private WORKSPACE_PATH = '/home/mnordberg/workspace';

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
