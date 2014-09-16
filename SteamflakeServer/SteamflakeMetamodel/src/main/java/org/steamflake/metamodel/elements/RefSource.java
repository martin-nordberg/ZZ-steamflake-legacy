package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * The type and look up source for a reference.
 */
public class RefSource<IElement extends IEntity> {

    public RefSource( Class<IElement> entityType, IElementLookUp store ) {
        this.entityType = entityType;
        this.store = store;
    }

    public final <IOtherElement extends IEntity> RefSource<IOtherElement> getSource( Class<IOtherElement> entityType ) {
        return this.store.getRefSource( entityType );
    }

    public Ref<IElement> lookUpEntityByUuid( UUID id ) {
        return this.store.lookUpEntityByUuid( this.entityType, id );
    }

    private final Class<IElement> entityType;

    private final IElementLookUp store;

}
