package org.steamflake.metamodel.registry;

import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.IElementLookUp;
import org.steamflake.metamodel.elements.Ref;

import java.util.UUID;

/**
 * Interface to a registry of elements by UUID.
 */
public interface IElementRegistry
    extends IElementLookUp {

    /**
     * Adds an entity to this registry.
     *
     * @param entity the entity to be added.
     */
    void registerEntity( Ref<? extends IEntity> entity );

    /**
     * Removes an entity from this registry.
     *
     * @param entityId the unique ID of the entity to remove.
     */
    void unregisterEntity( UUID entityId );

}
