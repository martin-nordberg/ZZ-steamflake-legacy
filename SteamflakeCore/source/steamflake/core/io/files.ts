/**
 * Module: steamflake/core/io/files
 */

///<reference path='../../../../../ThirdParty/lib/server/node.d.ts'/>

import platform = require( '../platform/platform' );
import promises = require( '../concurrency/promises' );
import values = require( '../utilities/values' );

import fs = require( 'fs' );
import path = require( 'path' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining a file or folder in a file system.
 */
export interface IFileResource {
    // forward
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining a file system path.
 */
export interface IPath {

    /** This path converted to a string. */
    asString : string;

    /** An array containing the individual elements of this path. */
    elements : string[];

    /** True if the path is an absolute path. */
    isAbsolute : boolean;

    /** The parent path of this path. */
    parent : IPath;

  ////

    /**
     * Builds a subpath within this path.
     */
    append( subPath : IPath ) : IPath;

    /**
     * Finds the file system resource corresponding to this path.
     */
    findResource() : promises.IPromise<IFileResource>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining a file or folder in a file system.
 */
export interface IFileResource {

    /** Whether this file resource is a file. */
    isFile : boolean;

    /** Whether this file system entry is a folder. */
    isFolder : boolean;

    /** Whether this file system entry is nonexistent. */
    isNonexistent : boolean;

    /** The path to the file system entry. */
    path : IPath;

  ////

    /**
     * Deletes this file or folder.
     */
    remove() : promises.IPromise<IFileResource>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining a file.
 */
export interface IFile
    extends IFileResource
{

    /**
     * Asynchronously reads the entire contents of this file.
     */
    readWholeContents() : promises.IPromise<string>;

    /**
     * Writes the given string into this file.
     * @param contents The new file contents.
     */
    writeWholeContents( contents : string ) : promises.IPromise<IFile>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining a folder.
 */
export interface IFolder
    extends IFileResource
{

    /**
     * Asynchronously enumerates all the files and folders inside this folder.
     */
    enumerateSubEntries() : promises.IPromise<IFileResource[]>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining a file resource that does not exist.
 */
export interface INonexistentFileResource
    extends IFileResource
{

    /**
     * Creates and writes the entire contents of a new file. Creates the parent folder first if needed.
     */
    establishFile( contents : string ) : promises.IPromise<IFile>;

    /**
     * Creates this resource as a folder (along with its parent folders as needed).
     */
    establishFolder() : promises.IPromise<IFolder>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A file or folder in a file system.
 */
class FileResource {

    /**
     * Constructs a new file resource.
     * @param path The path of the resource.
     */
    constructor( path : IPath ) {
        this._path = path;
    }

    /** Returns the path of this resource. */
    public get path() {
        return this._path;
    }
    public set path( value : IPath ) {
        throw new Error( "Attempted to change read only attribute - path." );
    }

    /** The path of this resource. */
    private _path : IPath;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A file.
 */
class File
    extends FileResource
    implements IFile
{

    /**
     * Constructs a new file
     * @param path The path to the file.
     */
    constructor( path: IPath ) {
        super( path );
    }

    /** Whether this file resource is a file. */
    public get isFile() {
        return true;
    }
    public set isFile( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isFile." );
    }

    /** Whether this file resource is a folder. */
    public get isFolder() {
        return false;
    }
    public set isFolder( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isFolder." );
    }

    /** Whether this file resource is nonexistent. */
    public get isNonexistent() {
        return false;
    }
    public set isNonexistent( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isNonexistent." );
    }

    /**
     * Reads the entire contents of this file.
     * @return Promised fulfilled with the contents of the file.
     */
    public readWholeContents() : promises.IPromise<string> {

        var self = this;
        var pathStr = self.path.asString;
        var result = promises.makePromise<string>();

        fs.readFile( pathStr, function( err : ErrnoException, buffer : NodeBuffer ) {
            if ( err ) {
                result.reject( "Failed to read file " + pathStr + ". " + err );
            }

            result.fulfill( buffer.toString() );
        } );

        return result;
    }

    /**
     * Deletes this file.
     * @return Promise fulfilled when the deletion is complete
     */
    public remove() {

        var self = this;
        var pathStr = self.path.asString;
        var result = promises.makePromise<IFileResource>();

        // asynchronously delete the file
        fs.unlink( pathStr, function( err? : ErrnoException ) {
            if ( err ) {
                result.reject( "Failed to delete file " + pathStr + ". " + err );
                return;
            }

            result.fulfill( self );
        } );

        return result;

    }

    /**
     * Writes or rewrites this file with given contents.
     * @param contents The contents to write to the file.
     * @return Promise fulfilled when the file has been written.
     */
    public writeWholeContents( contents : string ) : promises.IPromise<IFile> {

        var self = this;
        var pathStr = self.path.asString;
        var result = promises.makePromise<IFile>();

        fs.writeFile( pathStr, contents, function( err : ErrnoException ) {
            if ( err ) {
                result.reject( "Failed to write file " + pathStr + ". " + err );
                return;
            }

            result.fulfill( self );
        } );

        return result;

    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A folder.
 */
class Folder
    extends FileResource
    implements IFolder
{

    /**
     * Constructs a new folder
     * @param path The path to the folder.
     */
    constructor( path: IPath ) {
        super( path );
    }

    public enumerateSubEntries() {

        var self = this;
        var path = self.path;
        var pathStr = path.asString;
        var result = promises.makePromise<IFileResource[]>();

        // read the directory contents
        fs.readdir( pathStr, function( err : ErrnoException, subpathStrs : string[] ) {
            var promiseResult : promises.IPromise<IFileResource>[] = [];

            for ( var i=0 ; i<subpathStrs.length ; i+=1 ) {
                promiseResult.push( path.append( makePath( subpathStrs[i] ) ).findResource() );
            }

            promises.join( promiseResult ).then( function( fileResources : IFileResource[] ) {
                result.fulfill( fileResources );
            } );
        } );

        return result;

    }

    /** Whether this file resource is a file. */
    public get isFile() {
        return false;
    }
    public set isFile( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isFile." );
    }

    /** Whether this file resource is a folder. */
    public get isFolder() {
        return true;
    }
    public set isFolder( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isFolder." );
    }

    /** Whether this file resource is nonexistent. */
    public get isNonexistent() {
        return false;
    }
    public set isNonexistent( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isNonexistent." );
    }

    /**
     * Deletes this folder.
     * @return Promise fulfilled when the deletion is complete
     */
    public remove() {

        var self = this;
        var pathStr = self.path.asString;

        // function to remove the files and folders within a folder.
        var removeSubEntries = function( fileResources : IFileResource[] ) {

            var removals : promises.IPromise<IFileResource>[] = [];

            for ( var i = 0 ; i < fileResources.length ; i += 1 ) {
                removals.push( fileResources[i].remove() );
            }

            return promises.join( removals );

        };

        // function to remove this folder itself once empty
        var removeFolder = function( removedResources : IFileResource[] ) {

            var result = promises.makePromise<IFolder>();

            // asynchronously delete the folder
            fs.rmdir( pathStr, function( err? : ErrnoException ) {
                if ( err ) {
                    result.reject( "Failed to delete folder " + pathStr + ". " + err );
                    return;
                }

                result.fulfill( self );
            } );

            return result;

        };

        // function returns this folder as the final outcome
        var returnSelf = function( folder : IFolder ) {
            return self;
        };


        return self.enumerateSubEntries().then_p( removeSubEntries ).then_p( removeFolder ).then( returnSelf );

    }


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A folder.
 */
class NonexistentFileResource
    extends FileResource
    implements INonexistentFileResource
{

    /**
     * Creates and writes the entire contents of a new file. Creates the parent folder first if needed.
     */
    public establishFile( contents : string ) : promises.IPromise<IFile> {

        var self = this;
        var path = self.path;
        var pathStr = path.asString;
        var parentPath = path.parent;

        var result = promises.makePromise<IFile>();

        // function writes the file once the parent folder exists
        var writeFile = function() {

            fs.writeFile( pathStr, contents, function( err : ErrnoException ) {
                if ( err ) {
                    result.reject( "Failed to write file " + pathStr + ". " + err );
                    return;
                }

                result.fulfill( new File( path ) );
            } );

        };

        // check the status of the parent of the needed folder
        parentPath.findResource().then( function( parentResource : IFileResource ) {

            if ( parentResource.isFile ) {
                result.reject( "Cannot create file inside file: " + parentPath );
            }
            else if ( parentResource.isNonexistent ) {
                (<NonexistentFileResource>parentResource).establishFolder().then( function( parentFolder ) {
                    writeFile();
                } )
            }
            else {
                writeFile();
            }

        } ).then( null, function( reason : any ) {

            result.reject( reason );

        } );

        return result;
    }

    /**
     * Creates this resource as a folder (along with its parent folders as needed).
     */
    public establishFolder() {

        var self = this;
        var path = self.path;
        var parentPath = self.path.parent;

        var result = promises.makePromise<IFolder>();

        // function creates the folder itself, assuming parent folder exists
        var makeFolder = function() {

            fs.mkdir( path.asString, function( err? : ErrnoException ) {
                if ( err ) {
                    result.reject( "Failed to create folder: " + path.asString + ". " + err );
                    return;
                }

                result.fulfill( new Folder( path ) );
            } );

        };

        // check the status of the parent of the needed folder
        parentPath.findResource().then( function( parentResource : IFileResource ) {
            if ( parentResource.isFile ) {
                result.reject( "Cannot create folder inside file: " + parentPath );
            }
            else if ( parentResource.isNonexistent ) {
                (<NonexistentFileResource>parentResource).establishFolder().then( function( parentFolder ) {
                    makeFolder();
                } )
            }
            else {
                makeFolder();
            }
        } );

        return result;
    }

    /** Whether this file resource is a file. */
    public get isFile() {
        return false;
    }
    public set isFile( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isFile." );
    }

    /** Whether this file resource is a folder. */
    public get isFolder() {
        return false;
    }
    public set isFolder( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isFolder." );
    }

    /** Whether this file resource is nonexistent. */
    public get isNonexistent() {
        return true;
    }
    public set isNonexistent( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isNonexistent." );
    }

    /**
     * Deletes this folder.
     * @return Promise fulfilled when the deletion is complete
     */
    public remove() {
        return promises.makeImmediatelyFulfilledPromise<IFileResource>( this );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A file system path.
 */
class Path
    implements IPath
{

    /**
     * Constructs a new path.
     * @param pathStr The path as a string.
     */
    constructor( pathStr: string ) {

        // TBD: normalize out . and .. and trailing /
        // TBD: convert \ to /
        // TBD: exception for bad chars

        // remove unneeded double dots
        var doubleDotsRegex = /\/[^\/]+\/\.\.\//;
        while ( doubleDotsRegex.test( pathStr ) ) {
            pathStr = pathStr.replace( doubleDotsRegex, "/" )
        }

        this._pathStr = pathStr;
    }

    /** This path converted to a string. */
    public get asString() {
        return this._pathStr;
    }
    public set asString( value : string ) {
        throw new Error( "Attempted to change read only attribute - asString." );
    }

    /**
     * Builds a subpath within this path.
     */
    public append( subPath : IPath ) {
        if ( subPath.isAbsolute ) {
            return new Path( this.asString + subPath.asString );
        }
        return new Path( this.asString + "/" + subPath.asString );
    }

    /** An array containing the individual elements of this path. */
    public get elements() {
        return this._pathStr.split( "/" );
    }
    public set elements( value : string[] ) {
        throw new Error( "Attempted to change read only attribute - elements." );
    }

    /**
     * Finds the file system resource corresponding to this path.
     */
    public findResource() {

        var self = this;
        var result = promises.makePromise<IFileResource>();

        // look for the file resource
        fs.stat( self._pathStr, function( err : ErrnoException, stats : NodeJs.Fs.Stats ) {


            if ( err && err.code === 'ENOENT' ) {
                // if does not exist then NonexistentFileResource
                result.fulfill( new NonexistentFileResource( self ) );
            }
            else if ( err ) {
                // if some other error, reject
                result.reject( "Failed to search for file resource " + self._pathStr + ". " + err );
            }
            else if ( stats.isDirectory() ) {
                // if folder then Folder
                result.fulfill( new Folder( self ) );
            }
            else if ( stats.isFile() ) {
                // if file then File
                result.fulfill( new File( self ) );
            }
            // TBD: symbolic links

            else {
                result.reject( "Unrecognized file resource: " + self._pathStr );
            }

        } );

        return result;
    }

    /** True if the path is an absolute path. */
    public get isAbsolute() {
        return this._pathStr.charAt(0) === '/';
    }
    public set isAbsolute( value : boolean ) {
        throw new Error( "Attempted to change read only attribute - isAbsolute." );
    }

    /** The parent path of this path. */
    public get parent() : IPath {

        var lastSlash = this._pathStr.lastIndexOf( "/" );

        if ( lastSlash > 0 ) {
            return new Path( this._pathStr.substring( 0, lastSlash ) );
        }
        else if ( lastSlash === 0 ) {
            return new Path( "/" );
        }

        return new Path( "" )
    }
    public set parent( value : IPath ) {
        throw new Error( "Attempted to change read only attribute - parent." );
    }

  ////

    /** This path as a string. */
    private _pathStr : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new file resource path.
 * @param pathStr The string defining the path (always uses / as separator).
 * @return {IPath} The constructed path.
 */
export function makePath( pathStr : string ) : IPath {
    return new Path( pathStr );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

