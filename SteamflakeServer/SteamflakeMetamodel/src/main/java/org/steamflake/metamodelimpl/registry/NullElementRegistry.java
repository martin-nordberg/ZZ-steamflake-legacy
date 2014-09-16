package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IElementRegistry;

import java.util.UUID;

/**
 * Do nothing/find nothing element registry.
 */
public final class NullElementRegistry
    implements IElementRegistry {

    @Override
    public final <IElement extends IEntity> Ref<IElement> lookUpEntityByUuid( Class<IElement> entityType, UUID id ) {
        return Ref.missing();
    }

    @Override
    public final void registerEntity( Ref<? extends IEntity> entity ) {
        // do nothing
    }

    @Override
    public final void unregisterEntity( UUID entityId ) {
        // do nothing
    }

}
