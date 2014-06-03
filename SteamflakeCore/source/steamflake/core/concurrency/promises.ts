
/**
 * Module: steamflake/core/concurrency/promises
 */

import platform = require( '../platform/platform' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a promise..
 */
export interface IPromise<T1> {

    /**
     * Adds a pair of completion callbacks to this promise.
     * @param onFulfilled Function to be called when the promise is fulfilled.
     * @param onRejected Function to be called when the promise is rejected.
     */
    then<T2>(
        onFulfilled: ( value : T1 ) => T2,
        onRejected?: ( reason : any ) => any
    ) : IPromise<T2>;

    /**
     * Adds a pair of completion callbacks to this promise.
     * NOTE: Typescript type system does not really handle the Promises/A+ model faithfully. Really want
     *       just one "then" with an onFulfilled parameter that can return either a value or a promise.
     * @param onFulfilled Function to be called when the promise is fulfilled (returns a promise to be resolved).
     * @param onRejected Function to be called when the promise is rejected.
     */
    then_p<T2>(
        onFulfilled: ( value : T1 ) => IPromise<T2>,
        onRejected?: ( reason : any ) => any
    ) : IPromise<T2>;

// TBD: Asynchronous rejection
//    then<T2>(
//        onFulfilled: ( value : T1 ) => T2,
//        onRejected?: ( reason: any ) => IPromise<any>
//    ) : IPromise<T2>;
//    then<T2>(
//        onFulfilled: ( value : T1 ) => IPromise<T2>,
//        onRejected? : ( reason: any ) => IPromise<any>
//    ) : IPromise<T2>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a promise with methods to fulfill or reject it.
 */
export interface IPromiseResult<T>
    extends IPromise<T>
{

    /**
     * Fulfills the promise with given value.
     * @param value The promised value.
     */
    fulfill( value : T ) : void;

    /**
     * Rejects the promise for given reason.
     * @param reason The reason for failure.
     */
    reject( reason : any ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Possible states of a promise. */
enum EPromiseState {

    /** Waiting for fulfillment or rejection. */
    Pending,

    /** Fulfilled - value computed and ready. */
    Fulfilled,

    /** Rejected - computation failed. */
    Rejected

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Concrete implementation of a promise. */
class Promise<T1>
    implements IPromiseResult<T1> {

    /** Constructs a new promise, initially pending. */
    constructor() {
        this._onFulfilled = [];
        this._onRejected = [];
        this._state = EPromiseState.Pending;
    }

    /**
     * Fulfills the promise with given value.
     * @param value The promised value.
     */
    public fulfill( value : T1 ) {

        this.ensurePending();

        // TBD: Handle the case that value is itself a promise
        // TBD: Handle the case that value is "thenable"

        this._state = EPromiseState.Fulfilled;
        this._value = value;
        this.onFulfilled();

    }

    /**
     * Rejects the promise for given reason.
     * @param reason The reason for failure.
     */
    public reject( reason : any  ) {

        this.ensurePending();

        // TBD: Handle the case that reason is itself a promise
        // TBD: Handle the case that reason is "thenable"

        this._state = EPromiseState.Rejected;
        this._reason = reason;
        this.onRejected();

    }

    /**
     * Adds a pair of completion callbacks to this promise.
     * @param onFulfilled Function to be called when the promise is fulfilled.
     * @param onRejected Function to be called when the promise is rejected.
     */
    public then<T2>(
        onFulfilled: ( value : T1 ) => T2,
        onRejected?: ( reason: any ) => any
    ) : IPromise<T2> {

        var result = new Promise<T2>();

        // wrapper passes fulfillment of this promise on to the resulting promise
        var chainedOnFulfilled = function( value : T1 ) {
            try {
                var chainedValue = onFulfilled( value );
                result.fulfill( chainedValue );
            }
            catch ( err ) {
                result.reject( err );
            }
        };

        // wrapper passes rejection of this promise on to the resulting promise
        var chainedOnRejected = function( reason : any ) {
            var chainedReason : any = undefined;
            if ( onRejected ) {
                try {
                    chainedReason = onRejected( reason );
                }
                catch ( err ) {
                    chainedReason = err;
                }
            }
            if ( !chainedReason ) {
                chainedReason = reason;
            }
            result.reject( chainedReason );
        };

        // queue the two callbacks
        this._onFulfilled.push( chainedOnFulfilled );
        this._onRejected.push( chainedOnRejected );

        // handle immediately if appropriate
        if ( this._state === EPromiseState.Fulfilled ) {
            this.onFulfilled();
        }
        else if ( this._state === EPromiseState.Rejected ) {
            this.onRejected();
        }

        return result;

    }

    public then_p<T2>(
        onFulfilled: ( value : T1 ) => IPromise<T2>,
        onRejected?: ( reason: any ) => any
    ) : IPromise<T2> {

        var result = new Promise<T2>();

        // wrapper passes fulfillment of this promise on to the resulting promise
        var chainedOnFulfilled = function( value : T1 ) {
            try {
                var chainedValue = onFulfilled( value );
                result.resolve( <IPromiseResult<T2>> chainedValue );
            }
            catch ( err ) {
                result.reject( err );
            }
        };

        // wrapper passes rejection of this promise on to the resulting promise
        var chainedOnRejected = function( reason : any ) {
            var chainedReason : any = undefined;
            if ( onRejected ) {
                try {
                    chainedReason = onRejected( reason );
                }
                catch ( err ) {
                    chainedReason = err;
                }
            }
            if ( !chainedReason ) {
                chainedReason = reason;
            }
            result.reject( chainedReason );
        };

        // queue the two callbacks
        this._onFulfilled.push( chainedOnFulfilled );
        this._onRejected.push( chainedOnRejected );

        // handle immediately if appropriate
        if ( this._state === EPromiseState.Fulfilled ) {
            this.onFulfilled();
        }
        else if ( this._state === EPromiseState.Rejected ) {
            this.onRejected();
        }

        return result;

    }

  ////

    /**
     * Checks that the promise is still in a pending state.
     */
    private ensurePending() {

        if ( this._state === EPromiseState.Fulfilled ) {
            throw new Error( "Promise already fulfilled." );
        }
        else if ( this._state === EPromiseState.Rejected ) {
            throw new Error( "Promise already rejected." );
        }

    }

    /**
     * Handles calling all the onFulfilled registered callbacks.
     */
    private onFulfilled() {

        var self = this;

        self._onRejected = [];

        if ( self._onFulfilled.length > 0 ) {
            var fulfill = self._onFulfilled[0];
            self._onFulfilled.splice( 0, 1 );

            var fulfillRecursively = function() {
                // TBD: exception handling
                fulfill( self._value );
                self.onFulfilled();
            };

            platform.doWhenIdle( fulfillRecursively );
        }

    }

    /**
     * Handles calling all the registered onRejected callbacks.
     */
    private onRejected() {

        var self = this;

        self._onFulfilled = [];
        if ( self._onRejected.length > 0 ) {
            var reject = this._onRejected[0];
            self._onRejected.splice( 0, 1 );

            var rejectRecursively = function() {
                reject( self._reason );
                self.onRejected();
            };

            platform.doWhenIdle( rejectRecursively );
        }

    }

    /**
     * Resolves a promise into this one such that when the given promise is fulfilled or rejected, this one is also..
     * @param promise The promise received the forwarded result.
     */
    private resolve( promise : IPromiseResult<T1>  ) {

        var self = this;

        // forward the fulfillment of a promise
        var forwardFulfillment = function( value : T1 ) {
            self.fulfill( value );
        };

        // forward the rejection of a promise
        var forwardRejection = function( reason : any ) {
            self.reject( reason );
        };

        // establish the forwarding
        promise.then( forwardFulfillment, forwardRejection );

    }

  ////

    /** Queue of callbacks for a fulfilled promise. */
    private _onFulfilled: { ( value : T1 ) : void }[];

    /** Queue of callbacks for a rejected promise. */
    private _onRejected: { ( reason: any ) : void }[];

    /** Reason for rejection of this promise. */
    private _reason : any;

    /** The state of this promise. */
    private _state : EPromiseState;

    /** The promised value when fulfilled. */
    private _value : T1;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Makes a promise that is immediately fulfilled with given value.
 * @param value The value promised.
 * @returns the newly created promise
 */
export function makeImmediatelyFulfilledPromise<T>( value : T ) : IPromise<T> {
    var result = new Promise<T>();
    result.fulfill( value );
    return result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Makes a promise that is immediately rejected with given reason.
 * @param reason The reason for failure.
 * @returns the newly created promise
 */
export function makeImmediatelyRejectedPromise<T>( reason : any ) : IPromise<T> {
    var result = new Promise<T>();
    result.reject( reason );
    return result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Makes a promise that can be fulfilled by the client as appropriate.
 * @returns the newly created promise
 */
export function makePromise<T>() : IPromiseResult<T> {
    return new Promise<T>();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new promise that fulfills or rejects from the fulfillment or rejection of a whole
 * array of promises.
 * @param promises An array of promises whose overall result becomes the result of one new promise.
 * @return {IPromiseResult<T>} The new joined promise.
 */
export function join<T>( parallelPromises : IPromise<T>[] ) : IPromise<T[]> {

    if ( parallelPromises.length === 0 ) {
        return makeImmediatelyFulfilledPromise( [] );
    }

    var result = makePromise<T[]>();

    var values : T[] = [];

    // track the fulfillment of one result
    var joinFulfillment = function ( value : T ) {
        values.push( value );
        if ( values.length === parallelPromises.length ) {
            result.fulfill( values );
        }
    };

    // track the rejection of one result
    var joinRejection = function( reason : any ) {
        result.reject( reason );
    };

    // set up the join
    for ( var i=0 ; i<parallelPromises.length ; i+=1 ) {
        parallelPromises[i].then( joinFulfillment, joinRejection );
    }

    return result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
