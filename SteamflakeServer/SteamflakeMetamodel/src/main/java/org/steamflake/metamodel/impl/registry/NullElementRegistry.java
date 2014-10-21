package org.steamflake.metamodel.impl.registry;

import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;

import java.util.UUID;

/**
 * Do nothing/find nothing element registry.
 */
public final class NullElementRegistry
    extends AbstractElementLookUp
    implements IElementRegistry {

    @Override
    public final <Element extends IElement> Ref<Element> lookUpElementByUuid( Class<Element> entityType, UUID id ) {
        return Ref.missing();
    }

    @Override
    public final void registerElement( Ref<? extends IElement> element ) {
        // do nothing
    }

    @Override
    public final void unregisterElement( UUID elementId ) {
        // do nothing
    }

}
