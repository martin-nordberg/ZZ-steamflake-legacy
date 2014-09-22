package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * The type and look up source for an entity reference.
 */
public class RefSource<IElement extends IEntity> {

    /**
     * Constructs a new entity source for given entity type from the given store.
     * @param entityType the type of entity to find when needed.
     * @param store the store to look in.
     */
    public RefSource( Class<IElement> entityType, IElementLookUp store ) {
        this.entityType = entityType;
        this.store = store;
    }

    /**
     * Get the reference source for another kind of entity.
     * @param entityType the type of entity to be sourced.
     * @param <IOtherElement> the type of entity.
     * @return the reference source for the other entity type using the same source as this one.
     */
    public final <IOtherElement extends IEntity> RefSource<IOtherElement> getSource( Class<IOtherElement> entityType ) {
        return this.store.getRefSource( entityType );
    }

    /**
     * Looks up an entity by unique ID.
     * @param id the UUID of the entity to find.
     * @return a reference to the element.
     */
    public Ref<IElement> lookUpEntityByUuid( UUID id ) {
        return this.store.lookUpEntityByUuid( this.entityType, id );
    }

    /**
     * The type of entity found through this reference source.
     */
    private final Class<IElement> entityType;

    /**
     * The store from which entities are found.
     */
    private final IElementLookUp store;

}
