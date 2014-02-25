/**
 * Spec Module: steamflake/core/contracts/expectationsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import outcomes = require( '../../../../source/steamflake/core/contracts/outcomes' );
import expectations = require( '../../../../source/steamflake/core/contracts/expectations' );
import providers = require( '../../../../source/steamflake/core/contracts/providers' );

var aBoolean = providers.aBoolean;
var aString = providers.aString;

describe( "Expectations", function() {

    function ensureFailure( result : outcomes.IContractEnforcementResult, message? : string ) {
        expect( !result.isSuccess );
        if ( message ) {
            expect( result.message ).toEqual( message );
        }
    }

    function ensureSuccess( result : outcomes.IContractEnforcementResult, message? : string ) {
        expect( result.isSuccess );
        if ( message ) {
            expect( result.message ).toEqual( message );
        }
    }

    describe( "Boolean Contracts", function()  {

        it( "Works for true", function() {
            ensureSuccess( expectations.expect( true ).named( "good" ).toBe( aBoolean.thatIsTrue ),
                           "Verified good to be true." );
            ensureFailure( expectations.expect( true ).named( "good" ).toBe( aBoolean.thatIsFalse ),
                           "Expected good to be false, but was true." );
        } );

        it( "Works for false", function() {
            ensureSuccess( expectations.expect( false ).named( "bad" ).toBe( aBoolean.thatIsFalse ),
                           "Verified bad to be false." );
            ensureFailure( expectations.expect( false ).named( "bad" ).toBe( aBoolean.thatIsTrue ),
                           "Expected bad to be true, but was false." );
        } );

    } );

    describe( "String Contracts", function() {

        var emptyStr = "";
        var shortStr = "A";
        var longStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        it( "Works for an empty string", function() {
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withValue( "" ) ) );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.longerThan( 0 ) ) );
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.shorterThan( 1 ) ) );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatIsNonemptyWithMaximumLength( 1 ) ) );
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withMaximumLength( 1 ) ) );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withMinimumLength( 1 ) ) );
            //ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatContains( "A" ) ) );
            //ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatContainsAnyElementOf( {"A","B"} ) ) );
            //ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatContainsEveryElementOf( {"A","B"} ) ) );
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatIsEmpty ) );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatIsNonempty ) );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withLength( 1 ) ) );
        } );

        it( "Works for a short string", function() {
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.withValue( "A" ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.longerThan( 0 ) ) );
            ensureFailure( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.longerThan( 1 ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.shorterThan( 2 ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "emptyStr" ).toBe( aString.withMaximumLength( 1 ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "emptyStr" ).toBe( aString.thatIsNonemptyWithMaximumLength( 1 ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "emptyStr" ).toBe( aString.withMinimumLength( 1 ) ) );
            //ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatContains( "A" ) ) );
            //ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatContainsAnyElementOf( {"A","AB"} ) ) );
            //ensureFailure( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatContainsEveryElementOf( 'A'..'Z' ) ) );
            ensureFailure( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatIsEmpty ) );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatIsNonempty ) );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.withLength(1) ) );
        } );

        it( "Works for a long string", function() {
            ensureFailure( expectations.expect( longStr ).named( "longStr" ).toBe( aString.withValue( "xyz" ) ) );
            ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.longerThan( 0 ) ) );
            ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.longerThan( 1 ) ) );
            ensureFailure( expectations.expect( longStr ).named( "longStr" ).toBe( aString.shorterThan( 2 ) ) );
            ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.shorterThan( 53 ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "emptyStr" ).toBe( aString.withMaximumLength( 52 ) ) );
            ensureSuccess( expectations.expect( shortStr ).named( "emptyStr" ).toBe( aString.thatIsNonemptyWithMaximumLength( 52 ) ) );
            ensureFailure( expectations.expect( shortStr ).named( "emptyStr" ).toBe( aString.withMinimumLength( 53 ) ) );
            //ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatContains( "A" ) ) );
            //ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatContains( 'A' ) ) );
            //ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatContainsAnyElementOf( {"A","AB"} ) ) );
            //ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatContainsEveryElementOf( {"A","AB"} ) ) );
            //ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatContainsEveryElementOf( {'A','B','C'} ) ) );
            //ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatContainsEveryElementOf( 'A'..'C' ) ) );
            ensureFailure( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatIsEmpty ) );
            ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.thatIsNonempty ) );
            ensureSuccess( expectations.expect( longStr ).named( "longStr" ).toBe( aString.withLength(52) ) );
        } );

    } );

} );

