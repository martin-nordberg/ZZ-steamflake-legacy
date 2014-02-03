
/**
 * Module: steamflake/core/metamodel/persistence
 */

import elements = require( './elements' );
import options = require( '../utilities/options' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store creator that saves newly added model elements.
 */
export interface IPersistentStoreCreator {

    /**
     * Saves a newly created model element.
     * @param modelElement The just created model element to store.
     * @param options The callback options.
     */
    createModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : options.IOptionsOneResult<Element>
    ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store reader for model elements.
 */
export interface IPersistentStoreReader {

    /**
     * Queries this store for all the child elements of an already loaded model element.
     * @param containerElement The model element whose content is to be loaded.
     * @param options Callbacks to receive the exception that occurred or the successfully found result.
     */
    loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element,
        options : options.IOptionsOneResult<Element>
    ) : void;

    /**
     * Queries this store for a root container plus its (application-defined) immediate contents.
     * @param options Callbacks to receive the exception that occurred or the successfully found result.
     */
    loadRootModelElement<Element extends elements.IRootContainerElement>(
        options : options.IOptionsOneResult<Element>
    ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IPersistentStoreUpdaterOptions
    extends options.IOptionsFailure {

    /**
     * The names of the attributes that have changed.
     */
    changedAttributeNames : string[]

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store updater that saves changes in model elements.
 */
export interface IPersistentStoreUpdater {

    /**
     * Saves a changed model element.
     * @param modelElement The changed model element to save persistently.
     */
    updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : IPersistentStoreUpdaterOptions
    ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store deleter that removes deleted model elements.
 */
export interface IPersistentStoreDeleter {

    /**
     * Deletes a model element.
     * @param modelElement The model element to delete persistently.
     */
    deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : options.IOptionsFailure
    ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store for model elements.
 */
export interface IPersistentStore {

    /**
     * The creator service associated with this persistent store.
     */
    creator : IPersistentStoreCreator;

    /**
     * The deleter service associated with this persistent store.
     */
    deleter : IPersistentStoreDeleter;

    /**
     * The reader service associated with this store.
     */
    reader : IPersistentStoreReader;

    /**
     * The updater service associated with this store.
     */
    updater : IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op creator implementation. */
class NullPersistentStoreCreator
    implements IPersistentStoreCreator
{

    public createModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : options.IOptionsOneResult<Element>
    ) : void {
        // do nothing
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op reader. */
class NullPersistentStoreReader
    implements IPersistentStoreReader
{

    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element,
        options : options.IOptionsOneResult<Element>
    ) : void {
        throw Error( "Unexpected attempt to read from a null reader." );
    }

    public loadRootModelElement<Element extends elements.IRootContainerElement>(
        options : options.IOptionsOneResult<Element>
    ) : void {
        throw Error( "Unexpected attempt to read from a null reader." );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op updater. */
class NullPersistentStoreUpdater
     implements IPersistentStoreUpdater
{

    public updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : IPersistentStoreUpdaterOptions
    ) : void {
        // do nothing
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op deleter. */
class NullPersistentStoreDeleter
    implements IPersistentStoreDeleter
{

    public deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : options.IOptionsFailure
    ) : void {
        // do nothing
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op persistent store. */
class NullPersistentStore
    implements IPersistentStore
{

    constructor() {
        this._creator = new NullPersistentStoreCreator();
        this._deleter = new NullPersistentStoreDeleter();
        this._reader = new NullPersistentStoreReader();
        this._updater = new NullPersistentStoreUpdater();
    }

    public get creator() {
        return this._creator;
    }

    public get deleter() {
        return this._deleter;
    }

    public get reader() {
        return this._reader;
    }

    public get updater() {
        return this._updater;
    }

    private _creator : IPersistentStoreCreator;

    private _deleter : IPersistentStoreDeleter;

    private _reader : IPersistentStoreReader;

    private _updater : IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a no-op persistent store (No-op for create/update/delete; thrown error for read.)
 * @returns the newly created store
 */
export function makeNullPersistentStore() : IPersistentStore {
    return new NullPersistentStore();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

