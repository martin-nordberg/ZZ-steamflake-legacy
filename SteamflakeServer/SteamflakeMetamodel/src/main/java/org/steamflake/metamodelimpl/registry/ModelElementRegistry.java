package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Hash-table based registry of model elements.
 */
public class ModelElementRegistry
    implements IModelElementRegistry {

    /**
     * Constructs a new model element registry.
     */
    public ModelElementRegistry() {
        this.modelElements = new HashMap<>();
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends IModelElement> Optional<T> lookUpModelElementByUuid( Class<T> modelElementType, UUID id ) {

        IModelElement result = this.modelElements.get( id );

        if ( result != null && modelElementType.isAssignableFrom( result.getClass() ) ) {
            return Optional.of( (T) result );
        }

        return Optional.empty();

    }

    @Override
    public void registerModelElement( IModelElement modelElement ) {
        this.modelElements.put( modelElement.getId(), modelElement );
    }

    @Override
    public void unregisterModelElement( IModelElement modelElement ) {
        this.modelElements.remove( modelElement.getId() );
    }

    /**
     * The underlying hash table that implements the look up.
     */
    private final Map<UUID, IModelElement> modelElements;

}
