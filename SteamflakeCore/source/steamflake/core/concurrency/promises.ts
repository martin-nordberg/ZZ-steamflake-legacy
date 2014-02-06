
/**
 * Module: steamflake/core/concurrency/promises
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a promise..
 */
export interface IPromise<T> {

    /**
     * Adds a pair of completion callbacks to this promise.
     * @param onFulfilled Function to be called when the promise is fulfilled.
     * @param onRejected Function to be called when the promise is rejected.
     */
    then<T2>(
        onFulfilled: ( value : T ) => T2,
        onRejected?: ( reason: any ) => any
    ) : IPromise<T2>;

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
class Promise<T>
    implements IPromiseResult<T> {

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
    public fulfill( value : T ) {
        this._value = value;
        this._state = EPromiseState.Fulfilled;
        this.onFulfilled();
    }

    /**
     * Rejects the promise for given reason.
     * @param reason The reason for failure.
     */
    public reject( reason : any  ) {
        this._reason = reason;
        this._state = EPromiseState.Rejected;
        this.onRejected();
    }

    /**
     * Adds a pair of completion callbacks to this promise.
     * @param onFulfilled Function to be called when the promise is fulfilled.
     * @param onRejected Function to be called when the promise is rejected.
     */
    public then<T2>(
        onFulfilled: ( value : T ) => T2,
        onRejected?: ( reason: any ) => any
    ) : IPromise<T2> {
        var result = new Promise<T2>();

        // wrapper passes fulfillment of this promise on to the resulting promise
        function chainedOnFulfilled( value : T ) {
            try {
                var chainedValue = onFulfilled( value );
                result.fulfill( chainedValue );
            }
            catch ( err ) {
                result.reject( err );
            }
        }

        // wrapper passes rejection of this promise on to the resulting promise
        function chainedOnRejected( reason : any ) {
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
        }

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
     * Handles calling all the onFulfilled registered callbacks.
     */
    private onFulfilled() {
        var self = this;
        self._onRejected = [];
        if ( self._onFulfilled.length > 0 ) {
            var fulfill = self._onFulfilled[0];
            self._onFulfilled.splice( 0, 1 );

            function fulfillRecursively() {
                fulfill( self._value );
                self.onFulfilled();
            }

            self.queueCallback( fulfillRecursively );
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

            function rejectRecursively() {
                reject( self._reason );
                self.onRejected();
            }

            self.queueCallback( rejectRecursively );
        }
    }

    /**
     * Queues a callback into the event loop.
     * @param callback The callback to be executed when idle.
     */
    private queueCallback( callback : () => void ) {
        // TBD: setImmediate
        setTimeout( callback, 0 );
    }

  ////

    /** Queue of callbacks for a fulfilled promise. */
    private _onFulfilled: { ( value : T ) : void }[];

    /** Queue of callbacks for a rejected promise. */
    private _onRejected: { ( reason: any ) : void }[];

    /** Reason for rejection of this promise. */
    private _reason : any;

    /** The state of this promise. */
    private _state : EPromiseState;

    /** The promised value when fulfilled. */
    private _value : T;

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
 * @param value The reson for failure.
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