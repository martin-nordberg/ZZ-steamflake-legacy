package org.steamflake.metamodel.elements;

import java.util.UUID;


/**
 * Interface to a facility for finding entities and relationships by entity UUID.
 */
public interface IElementLookUp {

    /**
     * Finds a ref-source for given entity type.
     * @param entityType the type of entity.
     * @param <Entity> the type of entity.
     * @return the reference source for the given entity type using this look up.
     */
    <Entity extends IEntity> RefSource<Entity> getRefSource( Class<Entity> entityType );

    /**
     * Finds the entity with given UUID.
     *
     * @param entityType the type of entity to find.
     * @param id               the unique ID of the entity to find.
     * @param <Entity>       the type of entity to find.
     * @return the entity found or Ref.missing() if not registered.
     */
    <Entity extends IEntity> Ref<Entity> lookUpEntityByUuid( Class<Entity> entityType, UUID id );

}
