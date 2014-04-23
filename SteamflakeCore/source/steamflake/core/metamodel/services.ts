
/**
 * Module: steamflake/core/metamodel/services
 */

import elements = require( './elements' );
import persistence = require( './persistence' );
import promises = require( '../concurrency/promises' );
import registry = require( './registry' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a persistent store for Steamflake metamodel elements.
 */
export interface IQueryService<RootElement extends elements.IRootContainerElement> {

    /**
     * Queries the persistent store for all the child elements of an already loaded container. Also loads the
     * content into the registry maintained by this service.
     */
    loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element>;

    /**
     * Queries the persistent store for the root package plus all its namespaces and modules. Loads them into
     * the registry of code elements maintained by this service.
     */
    loadRootModelElement() : promises.IPromise<RootElement>;

    /**
     * Looks up a previously loaded model element by UUID.
     * @param uuid The UUID of the model element to find.
     */
    lookUpModelElementByUuid(
        uuid : string
    ) : elements.IModelElement;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A query service for Steamflake metamodel elements.
 */
class QueryService<RootElement extends elements.IRootContainerElement>
    implements IQueryService<RootElement> {

    /**
     * Constructs a new query service.
     * @param ModelElementRegistry The code element registry to maintain with query results.
     * @param reader The persistent store reader to query from.
     */
    constructor(
        reader : persistence.IPersistentStoreReader<RootElement>,
        ModelElementRegistry : registry.IModelElementRegistry
    ) {
        this._modelElementRegistry = ModelElementRegistry;
        this._reader = reader;
    }

    /**
     * Queries the persistent store for all the child elements of an already loaded container. Also loads the
     * content into the registry maintained by this service.
     */
    public loadModelElementContents<Element extends elements.IContainerElement>(
        containerElement : Element
    ) : promises.IPromise<Element> {

        var self = this;

        // easy if already loaded
        if ( containerElement.childElementsLoaded ) {
            return promises.makeImmediatelyFulfilledPromise( containerElement );
        }

        /** Registers the newly loaded children of a container. */
        var registerContents = function( containerElement : Element ) {
            containerElement.childElements.forEach( function( childElement : elements.IModelElement ) {
                self._modelElementRegistry.registerModelElement( childElement );
            } );
            return containerElement;
        };

        // delegate to the reader; register in the callback
        return self._reader.loadModelElementContents( containerElement ).then( registerContents );

    }

    /**
     * Queries the persistent store for the root package plus all its namespaces and modules. Loads them into
     * the registry of code elements maintained by this service.
     */
    public loadRootModelElement() : promises.IPromise<RootElement> {

        var self = this;

        var register = function( element : RootElement ) {
            self._modelElementRegistry.registerModelElement( element );
            return element;
        };

        return self._reader.loadRootModelElement().then( register );

    }

    /**
     * Looks up a previously loaded model element by UUID.
     * @param uuid The UUID of the model element to find.
     */
    public lookUpModelElementByUuid(
        uuid : string
    ) : elements.IModelElement {
        return this._modelElementRegistry.lookUpModelElementByUuid( uuid );
    }

    private _modelElementRegistry : registry.IModelElementRegistry;

    private _reader : persistence.IPersistentStoreReader<RootElement>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new query service.
 */
export function makeQueryService<RootElement extends elements.IRootContainerElement>(
    store : persistence.IPersistentStore<RootElement>,
    modelElementRegistry : registry.IModelElementRegistry
) : IQueryService<RootElement> {
    return new QueryService( store.reader, modelElementRegistry );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
