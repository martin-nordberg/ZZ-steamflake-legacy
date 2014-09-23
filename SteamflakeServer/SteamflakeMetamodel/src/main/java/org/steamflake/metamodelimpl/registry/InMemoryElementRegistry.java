package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IElement;
import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IElementRegistry;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Hash-table based registry of elements.
 */
public final class InMemoryElementRegistry
    extends AbstractElementRegistryDecorator {

    /**
     * Constructs a new element registry with no-op inner registry.
     */
    public InMemoryElementRegistry() {
        this( new NullElementRegistry() );
    }

    /**
     * Constructs a new element registry with given inner registry.
     *
     * @param delegate the inner registry to call upon when in-memory look finds nothing.
     */
    public InMemoryElementRegistry( IElementRegistry delegate ) {
        super( delegate );
        this.entities = new ConcurrentHashMap<>();   // TBD: VMap<> - versioned map
    }

    @SuppressWarnings("unchecked")
    @Override
    public final <Element extends IElement> Ref<Element> doLookUpElementByUuid( Class<Element> entityType, UUID id ) {

        Ref<? extends IElement> result = this.entities.get( id );

        if ( result != null ) {
            if ( result.isLoaded() ) {
                if ( !entityType.isAssignableFrom( result.get().getClass() ) ) {
                    throw new ClassCastException( "Attempted to retrieve entity with wrong type. Queried: " + entityType.getName() + " vs. Actual: " + result.get().getClass() );
                }
            }
            return (Ref<Element>) result;
        }

        return Ref.missing();

    }

    @Override
    public final void doRegisterElement( Ref<? extends IElement> element ) {
        this.entities.put( element.getId(), element );
    }

    @Override
    public final void doUnregisterElement( UUID elementId ) {
        this.entities.remove( elementId );
    }

    /**
     * The underlying hash table that implements the look up.
     */
    private final Map<UUID, Ref<? extends IElement>> entities;

}
