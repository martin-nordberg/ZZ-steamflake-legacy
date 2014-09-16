package org.steamflake.metamodelimpl.registry;

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
    public final <IElement extends IEntity> Ref<IElement> doLookUpEntityByUuid( Class<IElement> entityType, UUID id ) {

        Ref<? extends IEntity> result = this.entities.get( id );

        if ( result != null ) {
            if ( result.isLoaded() ) {
                if ( !entityType.isAssignableFrom( result.get().getClass() ) ) {
                    throw new ClassCastException( "Attempted to retrieve entity with wrong type. Queried: " + entityType.getName() + " vs. Actual: " + result.get().getClass() );
                }
            }
            return (Ref<IElement>) result;
        }

        return Ref.missing();

    }

    @Override
    public final void doRegisterEntity( Ref<? extends IEntity> entity ) {
        this.entities.put( entity.getId(), entity );
    }

    @Override
    public final void doUnregisterEntity( UUID entityId ) {
        this.entities.remove( entityId );
    }

    /**
     * The underlying hash table that implements the look up.
     */
    private final Map<UUID, Ref<? extends IEntity>> entities;

}
