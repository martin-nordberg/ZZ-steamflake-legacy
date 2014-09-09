package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Hash-table based registry of model elements.
 */
public final class InMemoryModelElementRegistry
    extends AbstractModelElementRegistryDecorator {

    /**
     * Constructs a new model element registry with no-op inner registry.
     */
    public InMemoryModelElementRegistry() {
        this( new NullModelElementRegistry() );
    }

    /**
     * Constructs a new model element registry with given inner registry.
     *
     * @param delegate the inner registry to call upon when in-memory look finds nothing.
     */
    public InMemoryModelElementRegistry( IModelElementRegistry delegate ) {
        super( delegate );
        this.modelElements = new ConcurrentHashMap<>();   // TBD: VMap<> - versioned map
    }

    @SuppressWarnings("unchecked")
    @Override
    public final <IElement extends IModelElement> Optional<Ref<IElement>> doLookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {

        Ref<? extends IModelElement> result = this.modelElements.get( id );

        if ( result != null ) {
            if ( result.isLoaded() ) {
                if ( !modelElementType.isAssignableFrom( result.get().getClass() ) ) {
                    throw new ClassCastException( "Attempted to retrieve model element with wrong type. Queried: " + modelElementType.getName() + " vs. Actual: " + result.get().getClass() );
                }
            }
            return Optional.of( (Ref<IElement>) result );
        }

        return Optional.empty();

    }

    @Override
    public final boolean doRegisterModelElement( Ref<? extends IModelElement> modelElement ) {
        this.modelElements.put( modelElement.getId(), modelElement );
        return true;
    }

    @Override
    public final boolean doUnregisterModelElement( UUID modelElementId ) {
        return this.modelElements.remove( modelElementId ) != null;
    }

    /**
     * The underlying hash table that implements the look up.
     */
    private final Map<UUID, Ref<? extends IModelElement>> modelElements;

}
