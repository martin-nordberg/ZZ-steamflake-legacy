package org.steamflake.metamodel.impl.registry;

import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;

import java.util.Objects;
import java.util.UUID;

/**
 * Element registry base class for building a chain of registries. The chain is constructed so that the
 * innermost registry is the first authority. This is so that outer registries can register elements that
 * have been looked up. For example, an outer database-backed registry can cache values in an inner memory-backed
 * registry. Also, the inner registry could be much longer-loved than an outer one.
 */
public abstract class AbstractElementRegistryDecorator
    extends AbstractElementLookUp
    implements IElementRegistry {

    /**
     * Constructs a new element registry.
     *
     * @param delegate the inner registry to delegate to when needed.
     */
    public AbstractElementRegistryDecorator( IElementRegistry delegate ) {
        this.delegate = delegate;
    }

    @Override
    public final <Element extends IElement> Ref<Element> lookUpElementByUuid( Class<Element> entityType, UUID id ) {

        // Try the inner registry first.
        Ref<Element> result = this.delegate.lookUpElementByUuid( entityType, id );

        // If not found, do our own look up.
        if ( result.isMissing() ) {
            result = this.doLookUpElementByUuid( entityType, id );
        }

        return result;

    }

    @Override
    public final void registerElement( Ref<? extends IElement> element ) {

        element.ifMissingThrow( NullPointerException::new );

        this.delegate.registerElement( element );

        this.doRegisterElement( element );

    }

    @Override
    public final void unregisterElement( UUID elementId ) {

        Objects.requireNonNull( elementId );

        this.doUnregisterElement( elementId );

        this.delegate.unregisterElement( elementId );

    }

    /**
     * Look up the entity of given type with given ID.
     *
     * @param elementType the type of element expected.
     * @param id          the unique ID of the element.
     * @param <Element>   the type of the element.
     * @return the element found or Ref.missing() if not registered.
     */
    protected abstract <Element extends IElement> Ref<Element> doLookUpElementByUuid( Class<Element> elementType, UUID id );

    /**
     * Registers an entity.
     *
     * @param entity the entity to register.
     */
    protected abstract void doRegisterElement( Ref<? extends IElement> entity );

    /**
     * Unregisters an entity given its unique ID.
     *
     * @param elementId the unique ID of the element to unregister.
     */
    protected abstract void doUnregisterElement( UUID elementId );

    /**
     * @return the inner registry wrapped by this one.
     */
    protected final IElementRegistry getDelegate() {
        return this.delegate;
    }

    /**
     * An inner registry to delegate to when needed.
     */
    private final IElementRegistry delegate;

}
