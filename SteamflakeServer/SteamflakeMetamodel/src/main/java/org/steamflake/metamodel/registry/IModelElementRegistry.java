package org.steamflake.metamodel.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;

import java.util.UUID;

/**
 * Interface to a registry of model elements by UUID.
 */
public interface IModelElementRegistry
    extends IModelElementLookUp {

    /**
     * Adds a model element to this registry.
     *
     * @param modelElement the model element to be added.
     */
    void registerModelElement( Ref<? extends IModelElement> modelElement );

    /**
     * Removes a model element from this registry.
     *
     * @param modelElementId the unique ID of the model element to remove.
     */
    void unregisterModelElement( UUID modelElementId );

}