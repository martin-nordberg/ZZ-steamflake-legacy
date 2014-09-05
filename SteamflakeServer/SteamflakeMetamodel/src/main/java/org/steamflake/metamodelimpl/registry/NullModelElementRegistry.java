package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.Optional;
import java.util.UUID;

/**
 * Do nothing/find nothing model element registry.
 */
public class NullModelElementRegistry
    implements IModelElementRegistry {

    @Override
    public <T extends IModelElement> Optional<T> lookUpModelElementByUuid( Class<T> modelElementType, UUID id ) {
        return Optional.empty();
    }

    @Override
    public void registerModelElement( IModelElement modelElement ) {
        // do nothing
    }

    @Override
    public void unregisterModelElement( IModelElement modelElement ) {
        // do nothing
    }

}
