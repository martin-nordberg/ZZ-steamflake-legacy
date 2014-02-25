
/**
 * Module: steamflake/core/contracts/expectations
 */

import contracts = require( './contracts' );
import outcomes = require( './outcomes' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface for the starting point of a fluent interface API for declarative contracts within BDD specifications.
 */
export interface IExpectation<T> {

    /**
     * Provides a value name to be used in messages arising from the contract built by this expectation.
     * @param name
     */
    named( name : string ) : IExpectation<T>;

    /**
     * Performs a contract check, giving back a contract check result.
     * @param contract
     */
    toBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult;

    /**
     * Performs a contract check on a value that is expected to not exist.
     */
    toNotExist() : outcomes.IContractEnforcementResult;

    /**
     * Performs a contract check if a value exists; gives back a contract check result,
     * succeeding if the tested actual value does not exist.
     * @param contract
     */
    toOptionallyBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class forms the start of a fluent interface API for declarative contracts within BDD specifications.
 */
class NonexistentExpectation<T>
    implements IExpectation<T> {

    constructor(
        name : string = "value"
    ) {
        this._name = name;
    }

    /**
     * Provides a value name to be used in messages arising from the contract built by this expectation.
     * @param name
     */
    public named( name : string ) : IExpectation<T> {
        return new NonexistentExpectation( name );
    }

    /**
     * Performs a contract check, giving back a contract check result.
     * @param contract
     */
    public toBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult {

        if ( this._name === "value" ) {
            return outcomes.makeContractEnforcementUnexpectedNull( "Expected a nonexistent value." );
        }

        return outcomes.makeContractEnforcementUnexpectedNull( "Expected a nonexistent value for " + this._name + "." );

    }

    /**
     * Performs a contract check on a value that is expected to not exist.
     */
    public toNotExist() : outcomes.IContractEnforcementResult {
        return outcomes.makeContractEnforcementSuccess( "Verified that " + this._name + " does not exist." );
    }

    /**
     * Performs a contract check if a value exists; gives back a contract check result,
     * succeeding if the tested actual value does not exist.
     * @param contract
     */
    public toOptionallyBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult {
        return outcomes.makeContractEnforcementSuccess( "Ignored nonexistent but optional " + this._name + "." );
    }

    private _name : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class forms the start of a fluent interface API for declarative contracts within BDD specifications.
 */
class ExistentExpectation<T>
    implements IExpectation<T> {

    constructor(
        actualValue : T,
        valueName : string = "value"
    ) {
        this._actualValue = actualValue;
        this._valueName = valueName;
    }

    /**
     * Provides a value name to be used in messages arising from the contract built by this expectation.
     * @param valueName
     */
    public named( valueName : string ) : IExpectation<T> {
        return new ExistentExpectation( this._actualValue, valueName );
    }

        /**
     * Performs a contract check, giving back a contract check result.
     * @param contract
     */
    public toBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult {
        return contract.enforce( this._actualValue, this._valueName );
    }

    /**
     * Performs a contract check on a value that is expected to not exist.
     */
    public toNotExist() : outcomes.IContractEnforcementResult {
        return outcomes.makeContractEnforcementUnexpectedNull( "Expected " + this._valueName + " to not exist, but is " + this._actualValue + "." );
    }

    /**
     * Performs a contract enforcement if a value exists; gives back a contract enforcement result,
     * succeeding if the tested actual value does not exist.
     * @param contract
     */
    public toOptionallyBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult {
        return contract.enforce( this._actualValue, this._valueName );
    }

    private _actualValue : T;

    private _valueName : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Adapter class wraps an expectation and throws an assertion if it fails when checked.
 */
class AssertedExpectation<T>
    implements IExpectation<T> {

    constructor(
        expectation : IExpectation<T>
    ) {
        this._expectation = expectation;
    }

    /**
     * Provides a value name to be used in messages arising from the contract built by this expectation.
     * @param valueName
     */
    public named( valueName : string ) : IExpectation<T> {
        return new AssertedExpectation( this._expectation.named( valueName ) );
    }

    /**
     * Performs a contract check, giving back a contract check result.
     * @param contract
     */
    public toBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult {
        return this.thrownIfFailed( this._expectation.toBe( contract ) );
    }

    /**
     * Performs a contract check on a value that is expected to not exist.
     */
    public toNotExist() : outcomes.IContractEnforcementResult {
        return this.thrownIfFailed( this._expectation.toNotExist() );
    }

    /**
     * Performs a contract check if a value exists; gives back a contract check result,
     * succeeding if the tested actual value does not exist.
     * @param contract
     */
    public toOptionallyBe( contract : contracts.IContract<T> ) : outcomes.IContractEnforcementResult {
        return this.thrownIfFailed( this._expectation.toOptionallyBe( contract ) );
    }

    /**
     * Throws an error if the given contract checking result is a failure; otherwise returns the successful result.
     */
    private thrownIfFailed( result : outcomes.IContractEnforcementResult ) {

        if ( !result.isSuccess ) {
            throw new Error( result.message );
        }

        return result;

    }

    private _expectation : IExpectation<T>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Top level function establishes the start of a declarative expectation.
 * @param actualValue The actual value expected to match one or more contracts.
 */
export function expect<T>( actualValue : T ) : IExpectation<T> {

    if ( typeof actualValue !== 'undefined' ) {
        return new ExistentExpectation( actualValue );
    }

    return new NonexistentExpectation<T>();

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Top level function establishes the start of a declarative asserted expectation. Intended for
 * writing function postconditions.
 * @param actualValue The actual value expected to match one or more contracts.
 */
export function guarantee<T>( actualValue : T ) : IExpectation<T> {
    return new AssertedExpectation( expect( actualValue ) );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Top level function establishes the start of a declarative asserted expectation. Intended for
 * writing function preconditions.
 * @param actualValue The actual value expected to match one or more contracts.
 */
export function verify<T>( actualValue : T ) : IExpectation<T> {
    return new AssertedExpectation( expect( actualValue ) );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

