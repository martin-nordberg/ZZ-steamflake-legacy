/**
 * Module: steamflake/core/utilities/options
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Base interface defines a callback for an exception result.
 */
export interface IOptionsFailure {

    /**
     * Callback for a failed query.
     * @param err The exception that occurred.
     */
    fail? : ( err : any ) => void

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defines options for success with one result.
 */
export interface IOptionsOneResult<T>
    extends IOptionsFailure
{

    /**
     * Callback for a successful query.
     * @param result The result object.
     */
    succeed : ( result : T ) => void

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface defines options for a collection of results.
 * Note: succeed() is to be called after all calls to eachItem(..).
 */
export interface IOptionsCollectionResult<Parent,Child>
    extends IOptionsOneResult<Parent>
{

    /**
     * Callback called for each item of the collection in sequence.
     * @param item The item in the collection.
     */
    eachItem : ( item : Child ) => void

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
