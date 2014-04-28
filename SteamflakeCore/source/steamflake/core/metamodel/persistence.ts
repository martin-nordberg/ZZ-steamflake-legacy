
/**
 * Module: steamflake/core/metamodel/persistence
 */

import elements = require( './elements' );
import promises = require( '../concurrency/promises' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store creator that saves newly added model elements.
 */
export interface IPersistentStoreCreator {

    /**
     * Saves a newly created model element.
     * @param modelElement The just created model element to store.
     */
    createModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store reader for model elements.
 */
export interface IPersistentStoreReader<RootElement extends elements.IRootContainerElement> {

    /**
     * Queries this store for all the child elements of an already loaded model element.
     * @param containerElement The model element whose content is to be loaded.
     */
    loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element>;

    /**
     * Queries this store for a root container plus its (application-defined) immediate contents.
     */
    loadRootModelElement() : promises.IPromise<RootElement>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IPersistentStoreUpdaterOptions {

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
     * @param options The attributes that have changed.
     */
    updateModelElement<Element extends elements.IModelElement>(
        modelElement : Element,
        options : IPersistentStoreUpdaterOptions
    ) : promises.IPromise<Element>;

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
        modelElement : Element
    ) : promises.IPromise<Element>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store for model elements.
 */
export interface IPersistentStore<RootElement extends elements.IRootContainerElement> {

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
    reader : IPersistentStoreReader<RootElement>;

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
        modelElement : Element
    ) : promises.IPromise<Element> {
        return promises.makeImmediatelyFulfilledPromise( modelElement );
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op reader. */
class NullPersistentStoreReader<RootElement extends elements.IRootContainerElement>
    implements IPersistentStoreReader<RootElement>
{

    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element> {
        throw Error( "Unexpected attempt to read from a null reader." );
    }

    public loadRootModelElement() : promises.IPromise<RootElement> {
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
    ) : promises.IPromise<Element> {
        return promises.makeImmediatelyFulfilledPromise( modelElement );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op deleter. */
class NullPersistentStoreDeleter
    implements IPersistentStoreDeleter
{

    public deleteModelElement<Element extends elements.IModelElement>(
        modelElement : Element
    ) : promises.IPromise<Element> {
        return promises.makeImmediatelyFulfilledPromise( modelElement );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** No-op persistent store. */
class NullPersistentStore<RootElement extends elements.IRootContainerElement>
    implements IPersistentStore<RootElement>
{

    constructor() {
        this._creator = new NullPersistentStoreCreator();
        this._deleter = new NullPersistentStoreDeleter();
        this._reader = new NullPersistentStoreReader<RootElement>();
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

    private _reader : IPersistentStoreReader<RootElement>;

    private _updater : IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a no-op persistent store (No-op for create/update/delete; thrown error for read.)
 * @returns the newly created store
 */
export function makeNullPersistentStore<RootElement extends elements.IRootContainerElement>() : IPersistentStore<RootElement> {
    return new NullPersistentStore<RootElement>();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

