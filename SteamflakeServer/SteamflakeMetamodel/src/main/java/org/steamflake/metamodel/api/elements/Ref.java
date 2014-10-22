package org.steamflake.metamodel.api.elements;

import org.steamflake.metamodel.impl.registry.NullElementRegistry;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Supplier;

/**
 * Reference to an element by UUID and ordinary Java reference. Useful for lazy loading (or non-loading) of
 * related entities. Provides Optional-like handling of missing values.
 *
 * @param <Element> the type of element referenced.
 */
public final class Ref<Element extends IElement> {

    /**
     * Constructs a new reference to an element with given ID.
     *
     * @param store   the store to retrieve the element from later if needed.
     * @param id      the unique ID of the element.
     * @param element the element itself.
     */
    private Ref( IElementLookUp store, UUID id, Element element ) {
        Objects.requireNonNull( store );
        this.store = store;
        this.id = id;
        this.element = new AtomicReference<>( element );
    }

    /**
     * Constructs a new reference object with the ID of an element that has not yet been loaded.
     *
     * @param store     the store to retrieve the element from if needed.
     * @param id        the unique ID of the element.
     * @param <Element> the type of element referenced.
     * @return the new reference.
     */
    public static <Element extends IElement> Ref<Element> byId( IElementLookUp store, UUID id ) {
        Objects.requireNonNull( id );
        return new Ref<>( store, id, null );
    }

    /**
     * Returns the equivalent of a null reference.
     *
     * @param <Element> the type of element referenced.
     * @return the null reference
     */
    @SuppressWarnings("unchecked")
    public static <Element extends IElement> Ref<Element> missing() {
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
     * Gets the referenced element. Looks it up in the associated store if needed.
     *
     * @return the referenced element.
     */
    public final Element get( Class<Element> elementType ) {

        Objects.requireNonNull( this.id );

        if ( this.element.get() == null ) {
            this.element.set( this.store.lookUpElementByUuid( elementType, this.id ).get( elementType ) );
        }

        Objects.requireNonNull( this.element.get() );

        return this.element.get();

    }

    /**
     * @return the unique ID of the element.
     */
    public final UUID getId() {
        Objects.requireNonNull( this.id );
        return this.id;
    }

    /**
     * @return the hash code of this reference (same as hash code of UUID which is same as element).
     */
    @Override
    public final int hashCode() {
        return Objects.hashCode( this.id );
    }

    /**
     * If an element is loaded, invokes a callback with the element, otherwise does nothing.
     *
     * @param consumer function to be executed if an element is loaded.
     */
    public final Ref<Element> ifLoaded( Consumer<? super Element> consumer ) {
        if ( this.element.get() != null ) {
            consumer.accept( this.element.get() );
        }
        return this;
    }

    /**
     * If the reference is missing, invoke a callback.
     *
     * @param consumer function to be executed if an element ID is not available.
     */
    public final Ref<Element> ifMissing( Supplier<Void> consumer ) {
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
    public final <X extends Throwable> Ref<Element> ifMissingThrow( Supplier<? extends X> exceptionSupplier ) throws X {
        if ( this.id == null ) {
            throw exceptionSupplier.get();
        }
        return this;
    }

    /**
     * If an element is not loaded, invokes a callback with the ID, otherwise does nothing.
     *
     * @param consumer function to be executed if an element is loaded.
     */
    public final Ref<Element> ifNotLoaded( Consumer<UUID> consumer ) {
        if ( this.element.get() == null ) {
            consumer.accept( this.id );
        }
        return this;
    }

    /**
     * If the reference is not missing, invoke a callback with the element ID, otherwise do nothing.
     *
     * @param consumer function to be executed if an element ID is available.
     */
    public final Ref<Element> ifNotMissing( Consumer<UUID> consumer ) {
        if ( this.id != null ) {
            consumer.accept( this.id );
        }
        return this;
    }

    /**
     * @return whether the value for the referenced ID is loaded in memory.
     */
    public final boolean isLoaded() {
        return this.element.get() != null;
    }

    /**
     * @return whether this is a reference to a missing element.
     */
    public final boolean isMissing() {
        return this.id == null;
    }

    /**
     * Constructs a reference to another type but using the same source as this reference.
     *
     * @param id             the unique ID of the referenced element.
     * @param <OtherElement> the type of the referenced element.
     * @return the new reference by ID using the same look up source as this reference.
     */
    public final <OtherElement extends IElement> Ref<OtherElement> makeRefById( UUID id ) {
        return Ref.byId( this.store, id );
    }

    /**
     * Returns this reference itself, or if missing, a new reference with given UUID.
     *
     * @param id the unique ID expected for the reference.
     * @return this reference or if missing, a new one with given ID.
     */
    public final Ref<Element> orById( UUID id ) {

        if ( this.id == null ) {
            return Ref.byId( this.store, id );
        }

        return this;

    }

    /**
     * Returns this reference itself, or if missing, a new reference provided by the given callback.
     *
     * @param supplier a callback that will provide the reference if needed.
     * @return this reference or if missing, a new one as supplied dynamically.
     */
    public final Ref<Element> orIfMissing( Supplier<Ref<Element>> supplier ) {

        if ( this.id == null ) {
            return supplier.get();
        }

        return this;

    }

    /**
     * Returns the referenced element, if loaded, otherwise throws an exception created by the provided supplier.
     *
     * @param <X>               type of the exception to be thrown.
     * @param exceptionSupplier the supplier that will return the exception to be thrown.
     * @return the present value.
     * @throws X if there is no value present.
     */
    public final <X extends Throwable> Element orThrow( Supplier<? extends X> exceptionSupplier ) throws X {
        if ( this.element.get() == null ) {
            throw exceptionSupplier.get();
        }

        return this.element.get();
    }

    /**
     * Sets the referenced element.
     *
     * @param elementType the type of the element referenced.
     * @param element     the element to be referenced by this object.
     * @return this reference object with the element set.
     */
    public Ref<Element> set( Class<Element> elementType, Element element ) {

        Objects.requireNonNull( element );

        if ( !this.element.compareAndSet( null, element ) ) {
            if ( !this.get( elementType ).equals( element ) ) {
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
     * Constant representing a missing value, generally from a failed look up.
     */
    @SuppressWarnings("unchecked")
    private static final Ref MISSING = new Ref( new NullElementRegistry(), null, null );

    /**
     * The referenced element itself.
     */
    private AtomicReference<Element> element;

    /**
     * The unique ID of the referenced element.
     */
    private final UUID id;

    /**
     * The store of element instances for reference look-ups.
     */
    private final IElementLookUp store;

}
