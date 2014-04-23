
/**
 * Module: steamflake/core/contracts/contracts
 */

import outcomes = require( './outcomes' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining the behavior of a contract. A contract enforces an actual value (of type T)
 * and returns a result indicating success, failure, or unexpected exception. Contracts also provide
 * a fluent interface for combining logically (and/or).
 */
export interface IContract<T> {

    /**
     * Builds a new contract that is the conjunction of this contract and another.
     * @param otherContract
     */
    and( otherContract : IContract<T> ) : IContract<T>;

    /**
     * Checks this contract against a given actual value with an optional name of that value
     * for use in message output.
     * @param actualValue
     * @param valueName
     */
    enforce( actualValue : T, valueName : string ) : outcomes.IContractEnforcementResult;

    /**
     * Builds a new contract that is the disjunction of this contract and another.
     * @param otherContract
     */
    or( otherContract : IContract<T> ) : IContract<T>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Abstract base implementation of a contract..
 */
class AbstractContract<T>
    implements IContract<T> {

    /**
     * Builds a new contract that is the conjunction of this contract and another.
     * @param otherContract
     */
    public and( otherContract : IContract<T> ) : IContract<T> {
        return new AndContract( this, otherContract );
    }

    /**
     * Checks this contract against a given actual value with an optional name of that value
     * for use in message output.
     * @param actualValue
     * @param valueName
     */
    public enforce( actualValue : T, valueName : string ) : outcomes.IContractEnforcementResult {
        throw new Error( "Abstract method" );
    }

    /**
     * Builds a new contract that is the disjunction of this contract and another.
     * @param otherContract
     */
    public or( otherContract : IContract<T> ) : IContract<T> {
        return new OrContract( this, otherContract );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Contract formed by the conjunction of two individual contracts.
 */
class AndContract<T>
    extends AbstractContract<T> {

    constructor(
        contract1 : IContract<T>,
        contract2 : IContract<T>
    ) {
        super();
        this._contract1 = contract1;
        this._contract2 = contract2;
    }

    /**
     * Checks this contract against a given actual value with an optional name of that value
     * for use in message output.
     * @param actualValue
     * @param valueName
     */
    public enforce( actualValue : T, valueName : string ) : outcomes.IContractEnforcementResult {

        var result1 = this._contract1.enforce( actualValue, valueName );

        if ( !result1.isSuccess ) {
            return result1;
        }

        var result2 = this._contract2.enforce( actualValue, valueName );
        if ( !result2.isSuccess ) {
            return result2;
        }

        return outcomes.makeContractEnforcementSuccess( result1.message + " -AND- " + result2.message );

    }

    private _contract1 : IContract<T>;

    private _contract2 : IContract<T>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Contract formed by the disjunction of two individual contracts.
 */
class OrContract<T>
    extends AbstractContract<T> {

    constructor(
        contract1 : IContract<T>,
        contract2 : IContract<T>
    ) {
        super();
        this._contract1 = contract1;
        this._contract2 = contract2;
    }

    /**
     * Checks this contract against a given actual value with an optional name of that value
     * for use in message output.
     * @param actualValue
     * @param valueName
     */
    public enforce( actualValue : T, valueName : string ) : outcomes.IContractEnforcementResult {

        var result1 = this._contract1.enforce( actualValue, valueName );

        if ( result1.isSuccess ) {
            return result1;
        }

        var result2 = this._contract2.enforce( actualValue, valueName );

        if ( result2.isSuccess ) {
            return result2;
        }

        return outcomes.makeContractEnforcementFailure( result1.message + " -AND- " + result2.message );

    }

    private _contract1 : IContract<T>;

    private _contract2 : IContract<T>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Common higher order contract that computes a test result from a predicate and functions that
 * compute the message depending on the outcome.
 */
class BasicContract<T>
    extends AbstractContract<T> {

    constructor(
        enforceCondition : (actualValue:T) => boolean,
        makeSuccessMessage : (valueName:string) => string,
        makeFailureMessage : (actualValue:T, valueName:string) => string,
        makeExceptionMessage : (actualValue:T, valueName:string) => string
    ) {
        super();
        this._enforceCondition = enforceCondition;
        this._makeExceptionMessage = makeExceptionMessage;
        this._makeFailureMessage = makeFailureMessage;
        this._makeSuccessMessage = makeSuccessMessage;
    }

    /**
     * Checks this contract against a given actual value with an optional name of that value
     * for use in message output.
     * @param actualValue
     * @param valueName
     */
    public enforce( actualValue : T, valueName : string ) : outcomes.IContractEnforcementResult {
        try {
            if ( this._enforceCondition( actualValue ) ) {
                return outcomes.makeContractEnforcementSuccess( this._makeSuccessMessage( valueName ) );
            }
            return outcomes.makeContractEnforcementFailure( this._makeFailureMessage( actualValue, valueName ) );
        }
        catch ( err ) {
            return outcomes.makeContractEnforcementUnexpectedException( this._makeExceptionMessage( actualValue, valueName ), err );
        }
    }

    private _enforceCondition : (actualValue:T) => boolean;

    private _makeSuccessMessage : (valueName:string) => string;

    private _makeFailureMessage : (actualValue:T, valueName:string) => string;

    private _makeExceptionMessage : (actualValue:T, valueName:string) => string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A contract with messages expressed in terms of a simple adjective like 'empty' or 'ready'.
 */
class AdjectivalContract<T>
    extends BasicContract<T> {

    constructor(
        enforceCondition : (actualValue:T) => boolean,
        adjective : string
    ) {
        var makeSuccessMessage = function( valueName : string ) {
            return "Verified " + valueName + " to be " + adjective + ".";
        };

        var makeFailureMessage = function( actualValue : T, valueName : string ) {
            return "Expected " + valueName + " to be " + adjective + ", but was " + this.valueToString(actualValue) + ".";
        };

        var makeExceptionMessage = function( actualValue : T, valueName : string ) {
            return "An exception occurred while checking whether " + valueName + " is " + adjective + ".";
        };

        super(
            enforceCondition,
            makeSuccessMessage,
            makeFailureMessage,
            makeExceptionMessage
        )
    }

    /**
     * Converts a value to a string, quoting the value if it is itself a string and eliding a long string
     * @param value The value to convert.
     */
    public valueToString( value : any ) : string {
        if ( typeof value === 'string' ) {
            var strVal : string = <string> value;
            if ( strVal.length > 23 ) {
                strVal = strVal.substring( 0, 10 ) + "..." + strVal.substring( strVal.length - 10 );
            }
            return "'" + strVal + "'";
        }
        else {
            return value.toString();
        }
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Typical higher order contract that produces standard messages for comparing an actual and comparable value.
 */
class ComparisonContract<T>
    extends AdjectivalContract<T> {

    constructor(
        enforceCondition : (actualValue:T) => boolean,
        comparisonText : string,
        comparableValue : T
    ) {
        super(
            enforceCondition,
            comparisonText + " " + this.valueToString(comparableValue)
        )
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new adjectival contract.
 * @param enforceCondition The predicate enforcing the adjective.
 * @param adjective The English word describing the contract.
 */
export function makeAdjectivalContract<T>(
    enforceCondition : (actualValue:T) => boolean,
    adjective : string
) : IContract<T> {
    return new AdjectivalContract( enforceCondition, adjective );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new comparison contract.
 * @param enforceCondition The predicate that does the comparison.
 * @param comparisonText English text describing the contract.
 * @param comparableValue The value to be compared.
 */
export function makeComparisonContract<T>(
    enforceCondition : (actualValue:T) => boolean,
    comparisonText : string,
    comparableValue : T
) : IContract<T> {
    return new ComparisonContract( enforceCondition, comparisonText, comparableValue );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

