/**
 * Spec Module: steamflake/core/io/filesSpec
 */

///<reference path='../../../../../ThirdParty/lib/server/node.d.ts'/>
///<reference path='../../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import fs = require( 'fs' );

import files = require( '../../../../source/steamflake/core/io/files' );


describe( "Files", function() {

    describe( "Paths", function () {

        it( "Converts a path to a string", function () {

            var path = files.makePath( "/tmp/nowhere/stuff.txt" );

            expect( path.asString ).toEqual( "/tmp/nowhere/stuff.txt" );

        } );

        it( "Finds the parent of an absolute path", function () {

            var path = files.makePath( "/tmp/nowhere/stuff.txt" );

            expect( path.isAbsolute ).toBeTruthy();

            expect( path.parent.asString ).toEqual( "/tmp/nowhere" );
            expect( path.parent.parent.asString ).toEqual( "/tmp" );
            expect( path.parent.parent.parent.asString ).toEqual( "/" );
            expect( path.parent.parent.parent.parent.asString ).toEqual( "/" );

        } );

        it( "Finds the parent of a relative path", function () {

            var path = files.makePath( "nowhere/stuff.txt" );

            expect( path.isAbsolute ).toBeFalsy();

            expect( path.parent.asString ).toEqual( "nowhere" );
            expect( path.parent.parent.asString ).toEqual( "" );
            expect( path.parent.parent.parent.asString ).toEqual( "" );

        } );

        it( "Splits a path into its elements", function () {

            var path = files.makePath( "aa/bb/cc/dd/ee.txt" );

            var elements = path.elements;

            expect( elements.length ).toEqual( 5 );

            expect( elements[0] ).toEqual( "aa" );
            expect( elements[1] ).toEqual( "bb" );
            expect( elements[2] ).toEqual( "cc" );
            expect( elements[3] ).toEqual( "dd" );
            expect( elements[4] ).toEqual( "ee.txt" );

        } );

        it( "Appends a subpath to a path", function () {

            var path = files.makePath( "/tmp/nowhere" );
            var subpath = files.makePath( "more/stuff.txt" );

            expect( path.append( subpath ).asString ).toEqual( "/tmp/nowhere/more/stuff.txt" )
        } );

    } );

    describe( "Folders", function () {

        it( "Creates and deletes a folder", function ( done : ()=>void ) {

            var path = files.makePath( "/tmp/testfolder1" );

            var establishFolder = function( nonfolder : files.IFileResource ) {
                expect( nonfolder.path ).toEqual( path );
                expect( nonfolder.isNonexistent ).toBeTruthy();
                return (<files.INonexistentFileResource> nonfolder).establishFolder();
            };

            var removeFolder = function( folder : files.IFolder ) {
                expect( folder.path ).toEqual( path );
                return folder.remove();
            };

            var finish = function( folder : files.IFolder ) {
                expect( folder.path ).toEqual( path );
                done();
            };

            path.findResource().then_p( establishFolder ).then_p( removeFolder ).then( finish );

        } );

        it( "Creates and deletes a folder with contents", function ( done : ()=>void ) {

            var path = files.makePath( "/tmp/testfolder2" );
            var subpath = path.append( files.makePath( "subfolder/stuff" ) );

            var establishSubFolder = function( nonsubfolder : files.IFileResource ) {
                expect( nonsubfolder.path ).toEqual( subpath );
                expect( nonsubfolder.isNonexistent ).toBeTruthy();
                return (<files.INonexistentFileResource> nonsubfolder).establishFolder();
            };

            var findFolder = function( subfolder : files.IFolder ) {
                expect( subfolder.path ).toEqual( subpath );
                return path.findResource();
            };

            var removeFolder = function( folder : files.IFolder ) {
                expect( folder.path ).toEqual( path );
                return folder.remove();
            };

            var finish = function( folder : files.IFolder ) {
                expect( folder.path ).toEqual( path );
                done();
            };

            subpath.findResource().then_p( establishSubFolder ).then_p( findFolder ).then_p( removeFolder ).then( finish );

        } );

    } );

} );
