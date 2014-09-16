package org.steamflake.metamodel.elements;

import java.util.UUID;


/**
 * Interface to a facility for finding elements by their UUID.
 */
public interface IElementLookUp {

    /**
     * Finds a ref-source for given entity type.
     * @param entityType the type of entity.
     * @param <IElement> the type of entity.
     * @return the reference source for the given entity type using this look up.
     */
    <IElement extends IEntity> RefSource<IElement> getRefSource( Class<IElement> entityType );

    /**
     * Finds the entity with given UUID.
     *
     * @param entityType the type of entity to find.
     * @param id               the unique ID of the entity to find.
     * @param <IElement>       the type of entity to find.
     * @return the entity found or Ref.missing() if not registered.
     */
    <IElement extends IEntity> Ref<IElement> lookUpEntityByUuid( Class<IElement> entityType, UUID id );

}
