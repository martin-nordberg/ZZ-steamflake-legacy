package org.steamflake.metamodel.elements;

import java.util.Objects;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Supplier;

/**
 * Reference to an object by UUID and ordinary Java reference. Supports lazy loading (or non-loading) of
 * related objects. Provides Optional-like handling of missing values.
 */
public final class Ref<IElement extends IEntity> {

    /**
     * Constructs a new reference to an entity with given ID.
     * @param id the unique ID of the entity.
     * @param entity the entity itself.
     */
    private Ref( UUID id, IElement entity ) {
        this.id = id;
        this.entity = entity;
    }

    /**
     * Constructs a new reference object with the ID of an entity that has not yet been loaded.
     *
     * @param id         the unique ID of the entity.
     * @param <IElement> the type of entity.
     * @return the new reference.
     */
    public static <IElement extends IEntity> Ref<IElement> byId( UUID id ) {
        Objects.requireNonNull( id );
        return new Ref<>( id, null );
    }

    /**
     * Returns the equivalent of a null reference.
     *
     * @param <T> the type of entity referenced.
     * @return the null reference
     */
    @SuppressWarnings("unchecked")
    public static <T extends IEntity> Ref<T> missing() {
        return Ref.MISSING;
    }

    /**
     * Constructs a new reference object to a given entity.
     *
     * @param entity the entity referenced.
     * @param <IElement>   the type of entity.
     * @return the new reference.
     */
    public static <IElement extends IEntity> Ref<IElement> to( IElement entity ) {
        Objects.requireNonNull( entity );
        return new Ref<>( entity.getId(), entity );
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

        if ( that == null || getClass() != that.getClass() ) {
            return false;
        }

        return that instanceof Ref && Objects.equals( this.id, ((Ref<?>) that).id );

    }

    /**
     * Gets the referenced entity.
     *
     * @return the referenced entity.
     */
    public final IElement get() {
        Objects.requireNonNull( this.entity );
        return this.entity;
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
     * If an entity is loaded, invokes a callback with the element, otherwise do nothing.
     *
     * @param consumer function to be executed if an entity is loaded.
     */
    public final void ifLoaded( Consumer<? super IElement> consumer ) {
        if ( this.entity != null ) {
            consumer.accept( this.entity );
        }
    }

    /**
     * Throws an exception created by the provided supplier if this reference has no UUID.
     *
     * @param <X>               type of the exception to be thrown.
     * @param exceptionSupplier the supplier that will return the exception to be thrown.
     * @throws X if there is no ID present.
     */
    public final <X extends Throwable> void ifMissingThrow( Supplier<? extends X> exceptionSupplier ) throws X {
        if ( this.id == null ) {
            throw exceptionSupplier.get();
        }
    }

    /**
     * If the reference is not missing, invoke a callback with the element ID, otherwise do nothing.
     *
     * @param consumer function to be executed if an entity ID is available.
     */
    public final void ifNotMissing( Consumer<UUID> consumer ) {
        if ( this.id != null ) {
            consumer.accept( this.id );
        }
    }

    /**
     * @return whether the value for the referenced ID is loaded in memory.
     */
    public final boolean isLoaded() {
        return this.entity != null;
    }

    /**
     * @return whether this is a reference to a missing element.
     */
    public final boolean isMissing() {
        return this.id == null;
    }

    /**
     * Returns this reference itself, or if missing a new reference with given UUID.
     * @param id the unique ID expected for the reference.
     * @return this reference or if missing, a new one with given ID.
     */
    public final Ref<IElement> orById( UUID id ) {

        if ( this.id == null ) {
            return Ref.byId( id );
        }

        return this;

    }

    /**
     * Returns this reference itself, or if missing, a new reference provided by the given callback.
     * @param supplier a callback that will provide the reference if needed.
     * @return this reference or if missing, a new one as supplied dynamically.
     */
    public final Ref<IElement> orIfMissing( Supplier<Ref<IElement>> supplier ) {

        if ( this.id == null ) {
            return supplier.get();
        }

        return this;

    }

    /**
     * Gets the referenced entity, looking it up by UUID if needed.
     *
     * @param type     the type of this Ref
     * @param registry a facility for looking up the referenced entity by UUID if needed.
     * @return the referenced entity.
     */
    public final IElement orLookUp( Class<IElement> type, IElementLookUp registry ) {

        Objects.requireNonNull( this.id );

        if ( this.entity == null ) {
            this.entity = registry.lookUpEntityByUuid( type, this.id ).get();
        }

        return this.entity;

    }

    /**
     * Returns the contained entity, if loaded, otherwise throws an exception created by the provided supplier.
     *
     * @param <X>               type of the exception to be thrown.
     * @param exceptionSupplier the supplier that will return the exception to be thrown.
     * @return the present value.
     * @throws X if there is no value present.
     */
    public final <X extends Throwable> IElement orThrow( Supplier<? extends X> exceptionSupplier ) throws X {
        if ( this.entity == null ) {
            throw exceptionSupplier.get();
        }

        return this.entity;
    }

    /**
     * Sets the referenced entity.
     * @param entity the entity to bereferenced by this object.
     * @return this reference object with the entity set.
     */
    public Ref<IElement> set( IElement entity ) {

        if ( this.entity != null ) {
            throw new IllegalStateException( "Cannot change reference once set." );
        }

        this.entity = entity;

        return this;

    }

    /**
     * @return a short string representation of this reference for debugging.
     */
    @Override
    public final String toString() {
        return "Ref(" + this.id + ")";
    }

    @SuppressWarnings("unchecked")
    private static final Ref MISSING = new Ref( null, null );

    /**
     * The unique ID of the referenced entity.
     */
    private final UUID id;

    /**
     * The referenced entity itself.
     */
    private IElement entity;

}
