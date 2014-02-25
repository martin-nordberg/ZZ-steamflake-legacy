
/**
 * Module: steamflake/core/contracts/providers
 */

import contracts = require( './contracts' );
import outcomes = require( './outcomes' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export var aBoolean = {

    /** Contract enforcing a false value for a boolean. */
    thatIsFalse : contracts.makeAdjectivalContract( (actualValue:boolean) => !actualValue, "false" ),

    /** Contract enforcing a true value for a boolean. */
    thatIsTrue : contracts.makeAdjectivalContract( (actualValue:boolean) => actualValue, "true" )

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export var aString = {

    /**
     * Computes a contract enforcing a string to be longer than a given length."
     * @param belowMinimumLength One less than the minimum allowed length of the string.
     */
    longerThan : function( belowMinimumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length > belowMinimumLength,
            "longer than "+belowMinimumLength
        );
    },

    /**
     * Computes a contract enforcing a string to be shorter than a given length."
     * @param aboveMaximumLength One more than the maximum allowed length of the string.
     */
    shorterThan : function( aboveMaximumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length > aboveMaximumLength,
            "shorter than "+aboveMaximumLength
        );
    },

    /**
     * Computes a contract enforcing a string to be empty.
     */
    thatIsEmpty : contracts.makeAdjectivalContract( (actualValue:string) => actualValue.length === 0, "empty" ),

    /**
     * Computes a contract enforcing a string to be nonempty.
     */
    thatIsNonempty : contracts.makeAdjectivalContract( (actualValue:string) => actualValue.length>0, "nonempty" ),

    /**
     * Computes a contract enforcing a string to be nonempty and shorter than or equal in length to a given value.
     * @param maximumLength The maximum allowed length of the string.
     */
    thatIsNonemptyWithMaximumLength : function( maximumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length > 0 && actualValue.length <= maximumLength,
            "nonempty with maximum length " + maximumLength
        )
    },

    /**
     * Computes a contract that checks that a string is equal in length to a given value.
     * @param length The expected length of a string.
     */
    withLength : function( length : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length === length,
            "exactly " + length + " characters in length"
        )
    },

    /**
     * Computes a contract that checks that a string is less than or equal in length to a given value.
     * @param maximumLength The maximum allowed length of a string.
     */
    withMaximumLength : function( maximumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length <= maximumLength,
            "at most " + maximumLength + " characters in length"
        )
    },

    /**
     * Computes a contract that checks that a string is greater than or equal in length to a given value.
     * @param minimumLength The minimum allowed length of a string.
     */
    withMinimumLength : function( minimumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length >= minimumLength,
            "at least " + minimumLength + " characters in length"
        )
    },

    /**
     * Computes a contract that checks that a string has exactly a given value.
     * @param expectedValue The expected value of a string.
     */
    withValue : function( expectedValue : string ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue === expectedValue,
            "equal to " + expectedValue
        )
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

