
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
    creator() : IPersistentStoreCreator;

    /**
     * The deleter service associated with this persistent store.
     */
    deleter() : IPersistentStoreDeleter;

    /**
     * The reader service associated with this store.
     */
    reader() : IPersistentStoreReader;

    /**
     * The updater service associated with this store.
     */
    updater() : IPersistentStoreUpdater;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

