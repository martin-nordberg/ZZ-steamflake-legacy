package org.steamflake.metamodel.api.registry;

import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.IElementLookUp;
import org.steamflake.metamodel.api.elements.Ref;

import java.util.UUID;

/**
 * Interface to a registry of elements by UUID.
 */
public interface IElementRegistry
    extends IElementLookUp {

    /**
     * Adds an element to this registry.
     *
     * @param element the entity to be added.
     */
    void registerElement( Ref<? extends IElement> element );

    /**
     * Removes an entity from this registry.
     *
     * @param elementId the unique ID of the entity to remove.
     */
    void unregisterElement( UUID elementId );

}
