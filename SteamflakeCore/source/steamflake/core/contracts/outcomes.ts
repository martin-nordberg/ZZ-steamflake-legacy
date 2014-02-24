
/**
 * Module: steamflake/core/contracts/outcomes
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defining the outcome of a contract checking operation.
 */
export interface IContractEnforcementResult {

    /**
     * Whether the contract was checked successfully. Note: read-only.
     */
    isSuccess : boolean;

    /**
     * The message describing this outcome of a contract checking operation.
     */
    message : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface for a contract checking result with an unexpected error thrown during checking.
 */
export interface IContractEnforcementUnexpectedException
    extends IContractEnforcementResult {

    /**
     * The exception that occurred.
     */
    error : Error

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ContractEnforcementResult
    implements IContractEnforcementResult {

    constructor(
        message : string
    ) {
        this._message = message;
    }

    /** Whether the contract check was successful. */
    public get isSuccess() {
        return false;
    }
    public set isSuccess( value : boolean ) {
        throw new Error( "Attempted to change read only attribute: isSuccess" );
    }

    /** The message summarizing this contract checking outcome. */
    public get message() {
        return this._message;
    }
    public set message( value : string ) {
        throw new Error( "Attempted to change read only attribute: message" );
    }

    private _message : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class representing a successful contract checking outcome.
 */
class ContractEnforcementSuccess
    extends ContractEnforcementResult {

    constructor(
        message : string
    ) {
        super( message );
    }

    public get isSuccess() {
        return true;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class representing a failed contract outcome with a given message explaining the failure.
 */
class ContractEnforcementFailure
    extends ContractEnforcementResult {

    constructor(
        message : string
    ) {
        super( message );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class representing a contract outcome that was unexpectedly checked on a null value.
 */
class ContractEnforcementUnexpectedNull
    extends ContractEnforcementResult {

    constructor(
        message : string
    ) {
        super( message );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class representing a contract outcome that unexpectedly threw an exception.
 */
class ContractEnforcementUnexpectedException
    extends ContractEnforcementResult
    implements IContractEnforcementUnexpectedException {

    constructor(
        message : string,
        error : Error
    ) {
        super( message );
        this._error = error;
    }

    /** The exception that occurred. */
    public get error() {
        return this._error;
    }
    public set error( value : Error ) {
        throw new Error( "Attempted to change read only attribute: error" );
    }

    private _error : Error;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ContractEnforcementComposite
    extends ContractEnforcementResult {

    constructor(
        message : string,
        childContractEnforcementResults : IContractEnforcementResult[]
    ) {
        super( message );
        this._childContractEnforcementResults = childContractEnforcementResults;
    }

    public get isSuccess() {
        for( var i=0 ; i<this._childContractEnforcementResults.length; i+=1 ) {
            if ( !this._childContractEnforcementResults[i].isSuccess ) {
                return false;
            }
        }
        return true;
    }

    private _childContractEnforcementResults : IContractEnforcementResult[];

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeContractEnforcementSuccess(
    message : string
) : IContractEnforcementResult {
    return new ContractEnforcementSuccess( message );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeContractEnforcementFailure(
    message : string
) : IContractEnforcementResult {
    return new ContractEnforcementFailure( message );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeContractEnforcementUnexpectedNull(
    message : string
) : IContractEnforcementResult {
    return new ContractEnforcementUnexpectedNull( message );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeContractEnforcementUnexpectedException(
    message : string,
    error : Error
) : IContractEnforcementResult {
    return new ContractEnforcementUnexpectedException( message, error );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeContractEnforcementComposite(
    message : string,
    childContractEnforcementResults : IContractEnforcementResult[]
) : IContractEnforcementResult {
    return new ContractEnforcementComposite( message, childContractEnforcementResults );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

