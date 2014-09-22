package org.steamflake.metamodel.elements;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Supplier;

/**
 * Reference to an entity by UUID and ordinary Java reference. Useful for lazy loading (or non-loading) of
 * related entities. Provides Optional-like handling of missing values.
 *
 * @param <Entity> the type of entity referenced.
 */
public final class Ref<Entity extends IEntity> {

    /**
     * Constructs a new reference to an entity with given ID.
     * @param refSource the type of entity referenced and the store to retrieve it from if needed.
     * @param id the unique ID of the entity.
     * @param entity the entity itself.
     */
    private Ref( RefSource<Entity> refSource, UUID id, Entity entity ) {
        Objects.requireNonNull( refSource );
        this.refSource = refSource;
        this.id = id;
        this.entity = new AtomicReference<>( entity );
    }

    /**
     * Constructs a new reference object with the ID of an entity that has not yet been loaded.
     *
     * @param refSource the type of entity referenced and the store to retrieve it from if needed.
     * @param id         the unique ID of the entity.
     * @param <IElement> the type of entity referenced.
     * @return the new reference.
     */
    public static <IElement extends IEntity> Ref<IElement> byId( RefSource<IElement> refSource, UUID id ) {
        Objects.requireNonNull( id );
        return new Ref<>( refSource, id, null );
    }

    /**
     * Returns the equivalent of a null reference.
     *
     * @param <Entity> the type of entity referenced.
     * @return the null reference
     */
    @SuppressWarnings("unchecked")
    public static <Entity extends IEntity> Ref<Entity> missing() {
        return Ref.MISSING;
    }

    /**
     * Tests whether this reference points to the same object as another.
     *
     * @param that the other reference.
     * @return true if they have the same UUID.
     */
    @SuppressWarnings("SimplifiableIfStatement")
    @Override
    public final boolean equals( Object that ) {

        if ( this == that ) {
            return true;
        }

        if ( that == null ) {
            return false;
        }

        if ( !(that instanceof Ref) ) {
            return false;
        }

        return Objects.equals( this.id, ((Ref<?>) that).id );

    }

    /**
     * Gets the referenced entity. Looks it up in the associated store if needed.
     *
     * @return the referenced entity.
     */
    public final Entity get() {

        Objects.requireNonNull( this.id );

        if ( this.entity.get() == null ) {
            this.entity.set( this.refSource.lookUpEntityByUuid( this.id ).get() );
        }

        Objects.requireNonNull( this.entity.get() );

        return this.entity.get();

    }

    /**
     * @return the unique ID of the entity.
     */
    public final UUID getId() {
        Objects.requireNonNull( this.id );
        return this.id;
    }

    /**
     * @return the hash code of this reference (same as hash code of UUID which is same as entity).
     */
    @Override
    public final int hashCode() {
        return Objects.hashCode( this.id );
    }

    /**
     * If an entity is loaded, invokes a callback with the element, otherwise does nothing.
     *
     * @param consumer function to be executed if an entity is loaded.
     */
    public final Ref<Entity> ifLoaded( Consumer<? super Entity> consumer ) {
        if ( this.entity.get() != null ) {
            consumer.accept( this.entity.get() );
        }
        return this;
    }

    /**
     * If the reference is missing, invoke a callback.
     *
     * @param consumer function to be executed if an entity ID is not available.
     */
    public final Ref<Entity> ifMissing( Supplier<Void> consumer ) {
        if ( this.id == null ) {
            consumer.get();
        }
        return this;
    }

    /**
     * Throws an exception created by the provided supplier if this reference has no UUID.
     *
     * @param <X>               type of the exception to be thrown.
     * @param exceptionSupplier the supplier that will return the exception to be thrown.
     * @throws X if there is no ID present.
     */
    public final <X extends Throwable> Ref<Entity> ifMissingThrow( Supplier<? extends X> exceptionSupplier ) throws X {
        if ( this.id == null ) {
            throw exceptionSupplier.get();
        }
        return this;
    }

    /**
     * If an entity is not loaded, invokes a callback with the ID, otherwise does nothing.
     *
     * @param consumer function to be executed if an entity is loaded.
     */
    public final Ref<Entity> ifNotLoaded( Consumer<UUID> consumer ) {
        if ( this.entity.get() == null ) {
            consumer.accept( this.id );
        }
        return this;
    }

    /**
     * If the reference is not missing, invoke a callback with the element ID, otherwise do nothing.
     *
     * @param consumer function to be executed if an entity ID is available.
     */
    public final Ref<Entity> ifNotMissing( Consumer<UUID> consumer ) {
        if ( this.id != null ) {
            consumer.accept( this.id );
        }
        return this;
    }

    /**
     * @return whether the value for the referenced ID is loaded in memory.
     */
    public final boolean isLoaded() {
        return this.entity.get() != null;
    }

    /**
     * @return whether this is a reference to a missing element.
     */
    public final boolean isMissing() {
        return this.id == null;
    }

    /**
     * Constructs a reference to another type but using the same source as this reference.
     * @param entityType the type of entity to reference.
     * @param id the unique ID of the referenced entity.
     * @param <OtherEntity> the type of the referenced entity.
     * @return the new reference by ID using the same look up source as this reference.
     */
    public final <OtherEntity extends IEntity> Ref<OtherEntity> makeRefById( Class<OtherEntity> entityType, UUID id ) {
        return Ref.byId( this.refSource.getSource( entityType ), id );
    }

    /**
     * Returns this reference itself, or if missing, a new reference with given UUID.
     * @param refSource the type of entity referenced and the store to retrieve it from if needed.
     * @param id the unique ID expected for the reference.
     * @return this reference or if missing, a new one with given ID.
     */
    public final Ref<Entity> orById( RefSource<Entity> refSource, UUID id ) {

        if ( this.id == null ) {
            return Ref.byId( refSource, id );
        }

        return this;

    }

    /**
     * Returns this reference itself, or if missing, a new reference provided by the given callback.
     * @param supplier a callback that will provide the reference if needed.
     * @return this reference or if missing, a new one as supplied dynamically.
     */
    public final Ref<Entity> orIfMissing( Supplier<Ref<Entity>> supplier ) {

        if ( this.id == null ) {
            return supplier.get();
        }

        return this;

    }

    /**
     * Returns the contained entity, if loaded, otherwise throws an exception created by the provided supplier.
     *
     * @param <X>               type of the exception to be thrown.
     * @param exceptionSupplier the supplier that will return the exception to be thrown.
     * @return the present value.
     * @throws X if there is no value present.
     */
    public final <X extends Throwable> Entity orThrow( Supplier<? extends X> exceptionSupplier ) throws X {
        if ( this.entity.get() == null ) {
            throw exceptionSupplier.get();
        }

        return this.entity.get();
    }

    /**
     * Sets the referenced entity.
     * @param entity the entity to be referenced by this object.
     * @return this reference object with the entity set.
     */
    public Ref<Entity> set( Entity entity ) {

        if ( !this.entity.compareAndSet( null, entity ) ) {
            if ( !this.get().equals( entity ) ) {
                throw new IllegalStateException( "Cannot change reference once set." );
            }
        }

        return this;

    }

    /**
     * @return a short string representation of this reference for debugging.
     */
    @Override
    public final String toString() {
        return "Ref(" + this.id + ")";
    }

    /**
     * Placeholder reference type for a missing value.
     */
    @SuppressWarnings("unchecked")
    private static final RefSource ABSENT = new RefSource( null, null );

    /**
     * Constant representing a missing value, generally from a failed look up.
     */
    @SuppressWarnings("unchecked")
    private static final Ref MISSING = new Ref( ABSENT, null, null );

    /**
     * The unique ID of the referenced entity.
     */
    private final UUID id;

    /**
     * The referenced entity itself.
     */
    private AtomicReference<Entity> entity;

    /**
     * The source of the entity if a look-up is needed.
     */
    private final RefSource<Entity> refSource;

}
