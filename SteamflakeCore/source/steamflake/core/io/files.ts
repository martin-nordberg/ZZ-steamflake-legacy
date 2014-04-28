/**
 * Module: steamflake/core/io/files
 */

///<reference path='../../../../../ThirdParty/lib/server/node.d.ts'/>

import platform = require( '../platform/platform' );
import promises = require( '../concurrency/promises' );
import values = require( '../utilities/values' );

import fs = require( 'fs' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates the given folder.
 * @param path The full path to a folder to create.
 * @return Promise fulfilled when the folder has been created.
 */
function makeFolder( path : string ) : promises.IPromise<values.ENothing> {

    var result = promises.makePromise<values.ENothing>();

    fs.mkdir( path, function( err? : ErrnoException ) {
        if ( err ) {
            result.reject( "Failed to create folder: " + path + ". " + err );
            return;
        }

        result.fulfill( values.nothing );
    } );

    return result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function deleteFile( path : string ) : promises.IPromise<values.ENothing> {

    var result = promises.makePromise<values.ENothing>();

    // TBD

    return result;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recursively ensures the existence of a folder and all its parents.
 * @param path The path of the folder to create.
 * @return Promise fulfilled when the folder exists.
 */
export function establishFolder( path : string ) : promises.IPromise<values.ENothing> {

    // set up the promise & helper functions
    var result = promises.makePromise<values.ENothing>();

    var onFulfill = function( value : values.ENothing = values.nothing ) {
        result.fulfill( value );
    };
    var onReject = function( reason : any ) {
        result.reject( reason );
    };

    // see if the folder already exists
    fs.stat( path, function( err : ErrnoException, stats : NodeJs.Fs.Stats ) {

        // if does not exist, recursively create from parent
        if ( err && err.code === 'ENOENT' ) {

            var lastSlash = path.lastIndexOf( "/" );

            if ( lastSlash > 0 ) {

                var parentPath = path.substring( 0, lastSlash );

                establishFolder( parentPath ).then(
                    function( value : values.ENothing ) {
                        makeFolder( path ).then( onFulfill, onReject );
                    },
                    onReject
                );
            }
            else {
                makeFolder( path ).then( onFulfill, onReject );
            }

            return;

        }

        // if some other error, quit
        if ( err ) {
            onReject( "Failed to search for folder " + path + ". " + err );
            return;
        }

        // if exists, all done
        if ( stats.isDirectory() ) {
            onFulfill();
            return;
        }

        onReject( "Not a folder: " + path );

    } );

    return result;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Reads the entire contents of a file.
 * @param path The path to the file.
 * @return Promised fulfilled with the contents of the file.
 */
export function readWholeFile( path : string ) : promises.IPromise<string> {

    var result = promises.makePromise<string>();

    fs.readFile( path, function( err : ErrnoException, buffer : NodeBuffer ) {
        if ( err ) {
            result.reject( "Failed to read file " + path + ". " + err );
        }

        result.fulfill( buffer.toString() );
    } );

    return result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Writes or rewrites a file with given contents.
 * @param path The path to the file.
 * @param contents The contents to write to the file.
 * @return Promise fulfilled when the file has been written.
 */
export function writeWholeFile( path : string, contents : string ) : promises.IPromise<values.ENothing> {

    var result = promises.makePromise<values.ENothing>();

    fs.writeFile( path, contents, function( err : ErrnoException ) {
        if ( err ) {
            result.reject( "Failed to write file " + path + ". " + err );
            return;
        }

        result.fulfill( values.nothing );
    } );

    return result;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
