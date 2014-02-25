
/**
 * Module: steamflake/core/contracts/providers
 */

import contracts = require( './contracts' );
import outcomes = require( './outcomes' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a contract provider that enforces equality or inequality of an actual value with an expected value.
 */
export interface IEqualityContracts<T> {

    /**
     * Returns a constraint that checks that an actual value equals an expected value.
     * @param expectedValue The value that test values are expected to be equal to.
     */
    equalTo( expectedValue : T ) : contracts.IContract<T>;

    /**
     * Returns a contract that checks that an actual value does not equal an expected value.
     * @param expectedNonValue The value that test values are expected to be different from.
     */
    notEqualTo( expectedNonValue : T ) : contracts.IContract<T>;

    /**
     * Returns a contract that checks that an actual value equals an expected value (synonym for equalTo).
     * @param expectedValue The value that test values are expected to be equal to.
     */
    withValue( expectedValue : T ) : contracts.IContract<T>

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a contract provider for boolean values.
 */
export interface IBooleanContracts
    extends IEqualityContracts<boolean> {

    /** Contract enforcing a false value for a boolean. */
    thatIsFalse : contracts.IContract<boolean>;

    /** Contract enforcing a true value for a boolean. */
    thatIsTrue : contracts.IContract<boolean>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a contract provider for string values.
 */
export interface IStringContracts
    extends IEqualityContracts<string> {

    /**
     * Computes a contract enforcing a string to be longer than a given length."
     * @param belowMinimumLength One less than the minimum allowed length of the string.
     */
    longerThan( belowMinimumLength : number ) : contracts.IContract<string>;

    /**
     * Computes a contract enforcing a string to be shorter than a given length."
     * @param aboveMaximumLength One more than the maximum allowed length of the string.
     */
    shorterThan( aboveMaximumLength : number ) : contracts.IContract<string>;

    /**
     * Computes a contract enforcing a string to be empty.
     */
    thatIsEmpty : contracts.IContract<string>;

    /**
     * Computes a contract enforcing a string to be nonempty.
     */
    thatIsNonempty : contracts.IContract<string>

    /**
     * Computes a contract enforcing a string to be nonempty and shorter than or equal in length to a given value.
     * @param maximumLength The maximum allowed length of the string.
     */
    thatIsNonemptyWithMaximumLength( maximumLength : number ) : contracts.IContract<string>;

    /**
     * Computes a contract that checks that a string is equal in length to a given value.
     * @param length The expected length of a string.
     */
    withLength( length : number ) : contracts.IContract<string>;

    /**
     * Computes a contract that checks that a string is less than or equal in length to a given value.
     * @param maximumLength The maximum allowed length of a string.
     */
    withMaximumLength( maximumLength : number ) : contracts.IContract<string>;

    /**
     * Computes a contract that checks that a string is greater than or equal in length to a given value.
     * @param minimumLength The minimum allowed length of a string.
     */
    withMinimumLength( minimumLength : number ) : contracts.IContract<string>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Abstract base class for contract providers that include equality comparisons.
 */
export class AbstractEqualityContracts<T>
    implements IEqualityContracts<T> {

    /**
     * Returns a constraint that checks that an actual value equals an expected value.
     * @param expectedValue The value that test values are expected to be equal to.
     */
    public equalTo( expectedValue : T ) {
        return contracts.makeComparisonContract<T>(
            (actualValue:T) => actualValue === expectedValue,
            "equal to",
            expectedValue
        );
    }

    /**
     * Returns a contract that checks that an actual value does not equal an expected value.
     * @param expectedNonValue The value that test values are expected to be different from.
     */
    public notEqualTo( expectedNonValue : T ) {
        return contracts.makeComparisonContract<T>(
            (actualValue:T) => actualValue !== expectedNonValue,
            "not equal to",
            expectedNonValue
        );
    }

    /**
     * Returns a contract that checks that an actual value equals an expected value (synonym for equalTo).
     * @param expectedValue The value that test values are expected to be equal to.
     */
    public withValue( expectedValue : T ) {
        return this.equalTo( expectedValue );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Concrete provider of contracts for boolean values.
 */
class BooleanContracts
    extends AbstractEqualityContracts<boolean>
    implements IBooleanContracts {

    constructor() {
        super();
        this._thatIsFalse = contracts.makeAdjectivalContract( (actualValue:boolean) => !actualValue, "false" )
        this._thatIsTrue = contracts.makeAdjectivalContract( (actualValue:boolean) => actualValue, "true" )
    }

    /** Contract enforcing a false value for a boolean. */
    public get thatIsFalse() {
        return this._thatIsFalse;
    }

    /** Contract enforcing a true value for a boolean. */
    public get thatIsTrue() {
        return this._thatIsTrue;
    }

    private _thatIsFalse : contracts.IContract<boolean>;

    private _thatIsTrue : contracts.IContract<boolean>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Concrete provider of contacts for string values.
 */
class StringContracts
    extends AbstractEqualityContracts<string>
    implements IStringContracts {

    constructor() {
        super();
        this._thatIsEmpty = contracts.makeAdjectivalContract( (actualValue:string) => actualValue.length === 0, "empty" );
        this._thatIsNonempty = contracts.makeAdjectivalContract( (actualValue:string) => actualValue.length>0, "nonempty" );
    }

    /**
     * Computes a contract enforcing a string to be longer than a given length."
     * @param belowMinimumLength One less than the minimum allowed length of the string.
     */
    public longerThan( belowMinimumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length > belowMinimumLength,
            "longer than " + belowMinimumLength
        );
    }

    /**
     * Computes a contract enforcing a string to be shorter than a given length."
     * @param aboveMaximumLength One more than the maximum allowed length of the string.
     */
    public shorterThan( aboveMaximumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length < aboveMaximumLength,
            "shorter than " + aboveMaximumLength
        );
    }

    /**
     * Computes a contract enforcing a string to be empty.
     */
    public get thatIsEmpty() {
        return this._thatIsEmpty;
    }

    /**
     * Computes a contract enforcing a string to be nonempty.
     */
    public get thatIsNonempty() {
        return this._thatIsNonempty;
    }

    /**
     * Computes a contract enforcing a string to be nonempty and shorter than or equal in length to a given value.
     * @param maximumLength The maximum allowed length of the string.
     */
    public thatIsNonemptyWithMaximumLength( maximumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length > 0 && actualValue.length <= maximumLength,
            "nonempty with maximum length " + maximumLength
        );
    }

    /**
     * Computes a contract that checks that a string is equal in length to a given value.
     * @param length The expected length of a string.
     */
    public withLength( length : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length === length,
            "exactly " + length + " characters in length"
        );
    }

    /**
     * Computes a contract that checks that a string is less than or equal in length to a given value.
     * @param maximumLength The maximum allowed length of a string.
     */
    public withMaximumLength( maximumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length <= maximumLength,
            "at most " + maximumLength + " characters in length"
        );
    }

    /**
     * Computes a contract that checks that a string is greater than or equal in length to a given value.
     * @param minimumLength The minimum allowed length of a string.
     */
    public withMinimumLength( minimumLength : number ) {
        return contracts.makeAdjectivalContract(
            (actualValue:string) => actualValue.length >= minimumLength,
            "at least " + minimumLength + " characters in length"
        )
    }

    private _thatIsEmpty : contracts.IContract<string>;

    private _thatIsNonempty : contracts.IContract<string>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Contract provider for boolean values.
 */
export var aBoolean : IBooleanContracts = new BooleanContracts();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Contract provider for string values.
 */
export var aString : IStringContracts = new StringContracts();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
