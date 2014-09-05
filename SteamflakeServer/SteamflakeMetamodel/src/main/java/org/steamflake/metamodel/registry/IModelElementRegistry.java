package org.steamflake.metamodel.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.IModelElementLookUp;

/**
 * Interface to a registry of model elements by UUID.
 */
public interface IModelElementRegistry
    extends IModelElementLookUp {

    /**
     * Adds a model element to this registry.
     *
     * @param modelElement The model element to be added.
     */
    void registerModelElement( IModelElement modelElement );

    /**
     * Removes a model element from this registry.
     *
     * @param modelElement The model element to remove.
     */
    void unregisterModelElement( IModelElement modelElement );

}
