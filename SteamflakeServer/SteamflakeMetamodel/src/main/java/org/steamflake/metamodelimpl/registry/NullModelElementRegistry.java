package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.Optional;
import java.util.UUID;

/**
 * Do nothing/find nothing model element registry.
 */
public final class NullModelElementRegistry
    implements IModelElementRegistry {

    @Override
    public final <IElement extends IModelElement> Optional<Ref<IElement>> lookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {
        return Optional.empty();
    }

    @Override
    public final boolean registerModelElement( Ref<? extends IModelElement> modelElement ) {
        return false;
    }

    @Override
    public final boolean unregisterModelElement( UUID modelElementId ) {
        return false;
    }

}
