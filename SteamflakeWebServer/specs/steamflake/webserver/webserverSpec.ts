

///<reference path='../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import webserver = require( '../../../source/steamflake/webserver/webserver' );

describe( "Web Server", function() {

    it( "Constructs", function() {

        var ws = webserver.makeSteamflakeWebServer();

        expect( ws ).not.toBeNull();

    } );

} );


