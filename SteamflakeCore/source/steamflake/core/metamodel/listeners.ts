
/**
 * Module: steamflake/core/metamodel/listeners
 */

import elements = require( './elements' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a service that listens for changes in model elements.
 */
export interface IUpdateListener {

    /**
     * Registers a listener to make updates to the database when a model element changes.
     * @param modelElement The model element to keep up to date.
     */
    listenForChanges(
        modelElement : elements.IModelElement
    ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

