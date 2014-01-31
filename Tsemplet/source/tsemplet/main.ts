
///<reference path='../thirdparty/node.d.ts'/>

console.log( "Tsemplet TBD ..." );

// print process.argv
process.argv.forEach( function ( val : string, index : number, array : string[] ) : void {
    console.log( index + ': ' + val );
} );
