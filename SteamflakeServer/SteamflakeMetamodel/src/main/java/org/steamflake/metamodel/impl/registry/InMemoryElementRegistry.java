package org.steamflake.metamodel.impl.registry;

import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;

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
        this.elements = new ConcurrentHashMap<>();   // TBD: VMap<> - versioned map
    }

    @SuppressWarnings("unchecked")
    @Override
    public final <Element extends IElement> Ref<Element> doLookUpElementByUuid( Class<Element> elementType, UUID id ) {

        Ref<Element> result = (Ref<Element>) this.elements.get( id );

        if ( result != null ) {
            if ( result.isLoaded() ) {
                if ( !elementType.isAssignableFrom( result.get().getClass() ) ) {
                    throw new ClassCastException( "Attempted to retrieve element with wrong type. Queried: " +
                        elementType.getName() + " vs. Actual: " + result.get().getClass() );
                }
            }
            return result;
        }

        return Ref.missing();

    }

    @Override
    public final void doRegisterElement( Ref<? extends IElement> element ) {
        this.elements.put( element.getId(), element );
    }

    @Override
    public final void doUnregisterElement( UUID elementId ) {
        this.elements.remove( elementId );
    }

    /**
     * The underlying hash table that implements the look up.
     */
    private final Map<UUID, Ref<? extends IElement>> elements;

}
