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
            ensureSuccess( expectations.expect( true ).named( "good" ).toBe( aBoolean.withValue(true) ),
                           "Verified good to be equal to true." );
            ensureFailure( expectations.expect( true ).named( "good" ).toBe( aBoolean.withValue(false) ),
                           "Expected good to be equal to false, but was true." );
            ensureSuccess( expectations.expect( true ).named( "good" ).toBe( aBoolean.notEqualTo(false) ),
                           "Verified good to be not equal to false." );
            ensureFailure( expectations.expect( true ).named( "good" ).toBe( aBoolean.notEqualTo(true) ),
                           "Expected good to be not equal to true, but was true." );
            ensureSuccess( expectations.expect( true ).named( "good" ).toBe( aBoolean.thatIsTrue ),
                           "Verified good to be true." );
            ensureFailure( expectations.expect( true ).named( "good" ).toBe( aBoolean.thatIsFalse ),
                           "Expected good to be false, but was true." );
        } );

        it( "Works for false", function() {
            ensureSuccess( expectations.expect( false ).named( "bad" ).toBe( aBoolean.withValue(false) ),
                           "Verified bad to be equal to false." );
            ensureFailure( expectations.expect( false ).named( "bad" ).toBe( aBoolean.withValue(true) ),
                           "Expected bad to be equal to true, but was false." );
            ensureSuccess( expectations.expect( false ).named( "bad" ).toBe( aBoolean.notEqualTo(true) ),
                           "Verified bad to be not equal to true." );
            ensureFailure( expectations.expect( false ).named( "bad" ).toBe( aBoolean.notEqualTo(false) ),
                           "Expected bad to be not equal to false, but was false." );
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
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withValue( "" ) ),
                           "Verified emptyStr to be equal to ''.");
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.longerThan( 0 ) ),
                           "Expected emptyStr to be longer than 0, but was ''.");
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.shorterThan( 1 ) ),
                           "Verified emptyStr to be shorter than 1.");
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatIsNonemptyWithMaximumLength( 1 ) ),
                           "Expected emptyStr to be nonempty with maximum length 1, but was ''." );
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withMaximumLength( 1 ) ),
                           "Verified emptyStr to be at most 1 characters in length.");
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withMinimumLength( 1 ) ),
                           "Expected emptyStr to be at least 1 characters in length, but was ''.");
            //ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatContains( "A" ) ) );
            //ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatContainsAnyElementOf( {"A","B"} ) ) );
            //ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatContainsEveryElementOf( {"A","B"} ) ) );
            ensureSuccess( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatIsEmpty ),
                           "Verified emptyStr to be empty." );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.thatIsNonempty ),
                           "Expected emptyStr to be nonempty, but was ''." );
            ensureFailure( expectations.expect( emptyStr ).named( "emptyStr" ).toBe( aString.withLength( 1 ) ),
                           "Expected emptyStr to be exactly 1 characters in length, but was ''.");
        } );

        it( "Works for a short string", function() {
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.withValue( "A" ) ),
                           "Verified shortStr to be equal to 'A'." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.longerThan( 0 ) ),
                           "Verified shortStr to be longer than 0." );
            ensureFailure( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.longerThan( 1 ) ),
                           "Expected shortStr to be longer than 1, but was 'A'." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.shorterThan( 2 ) ),
                           "Verified shortStr to be shorter than 2." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.withMaximumLength( 1 ) ),
                           "Verified shortStr to be at most 1 characters in length." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatIsNonemptyWithMaximumLength( 1 ) ),
                           "Verified shortStr to be nonempty with maximum length 1." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.withMinimumLength( 1 ) ),
                           "Verified shortStr to be at least 1 characters in length.");
            //ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatContains( "A" ) ) );
            //ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatContainsAnyElementOf( {"A","AB"} ) ) );
            //ensureFailure( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatContainsEveryElementOf( 'A'..'Z' ) ) );
            ensureFailure( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatIsEmpty ),
                           "Expected shortStr to be empty, but was 'A'." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.thatIsNonempty ),
                           "Verified shortStr to be nonempty." );
            ensureSuccess( expectations.expect( shortStr ).named( "shortStr" ).toBe( aString.withLength(1) ),
                           "Verified shortStr to be exactly 1 characters in length." );
        } );

        it( "Works for a long string", function() {
            ensureFailure( expectations.expect( longStr ).named( "longStr" ).toBe( aString.withValue( "xyz" ) ),
                           "Expected longStr to be equal to 'xyz', but was 'ABCDEFGHIJ...qrstuvwxyz'." );
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

