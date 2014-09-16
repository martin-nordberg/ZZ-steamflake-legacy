package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.*;
import org.steamflake.metamodel.registry.IElementRegistry;

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
    public final <IElement extends IEntity> Ref<IElement> lookUpEntityByUuid( Class<IElement> entityType, UUID id ) {

        // Try the inner registry first.
        Ref<IElement> result = this.delegate.lookUpEntityByUuid( entityType, id );

        // If not found, do our own look up.
        if ( result.isMissing() ) {
            result = this.doLookUpEntityByUuid( entityType, id );
        }

        return result;

    }

    @Override
    public final void registerEntity( Ref<? extends IEntity> entity ) {

        entity.ifMissingThrow( NullPointerException::new );

        this.delegate.registerEntity( entity );

        this.doRegisterEntity( entity );

    }

    @Override
    public final void unregisterEntity( UUID entityId ) {

        Objects.requireNonNull( entityId );

        this.doUnregisterEntity( entityId );

        this.delegate.unregisterEntity( entityId );

    }

    /**
     * Look up the entity of given type with given ID.
     *
     * @param entityType the type of element expected.
     * @param id               the unique ID of the element.
     * @param <IElement>       the type of the element.
     * @return the element found or Ref.missing() if not registered.
     */
    protected abstract <IElement extends IEntity> Ref<IElement> doLookUpEntityByUuid( Class<IElement> entityType, UUID id );

    /**
     * Registers an entity.
     *
     * @param entity the entity to register.
     */
    protected abstract void doRegisterEntity( Ref<? extends IEntity> entity );

    /**
     * Unregisters an entity given its unique ID.
     *
     * @param entityId the unique ID of the element to unregister.
     */
    protected abstract void doUnregisterEntity( UUID entityId );

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
