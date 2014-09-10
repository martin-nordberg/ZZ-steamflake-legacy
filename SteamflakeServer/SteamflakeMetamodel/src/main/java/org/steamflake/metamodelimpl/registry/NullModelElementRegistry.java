package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.UUID;

/**
 * Do nothing/find nothing model element registry.
 */
public final class NullModelElementRegistry
    implements IModelElementRegistry {

    @Override
    public final <IElement extends IModelElement> Ref<IElement> lookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {
        return Ref.missing();
    }

    @Override
    public final void registerModelElement( Ref<? extends IModelElement> modelElement ) {
        // do nothing
    }

    @Override
    public final void unregisterModelElement( UUID modelElementId ) {
        // do nothing
    }

}
