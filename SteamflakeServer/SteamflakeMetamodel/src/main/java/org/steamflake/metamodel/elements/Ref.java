package org.steamflake.metamodel.elements;

import java.util.Objects;
import java.util.UUID;

/**
 * Reference to an object by UUID and ordinary Java reference. Supports lazy loading (or non-loading) of
 * related objects.
 */
public final class Ref<IElement extends IModelElement> {

    // TBD: Combine in the functionality of Optional

    private Ref( UUID id, IElement modelElement ) {
        this.id = id;
        this.modelElement = modelElement;
    }

    /**
     * Constructs a reference to an already loaded model element.
     *
     * @param modelElement the object itself.
     */
    public Ref( IElement modelElement ) {
        this.id = modelElement.getId();
        this.modelElement = modelElement;
    }

    /**
     * Returns the equivalent of a null reference.
     * @param <T> the type of model element referenced.
     * @return the null reference
     */
    @SuppressWarnings("unchecked")
    public static <T extends IModelElement> Ref<T> missing() {
        return Ref.MISSING;
    }

    /**
     * Constructs a new reference object to a given model element.
     * @param modelElement the model element referenced.
     * @param <IElement> the type of model element.
     * @return the new reference.
     */
    public static <IElement extends IModelElement> Ref<IElement> to( IElement modelElement ) {
        Objects.requireNonNull( modelElement );
        return new Ref<>( modelElement.getId(), modelElement );
    }

    /**
     * Constructs a new reference object to a given model element.
     * @param modelElement the model element referenced.
     * @param <IElement> the type of model element.
     * @return the new reference.
     */
    @SuppressWarnings("unchecked")
    public static <IElement extends IModelElement> Ref<IElement> toNullable( IElement modelElement ) {
        if ( modelElement == null ) {
            return MISSING;
        }
        return new Ref<>( modelElement.getId(), modelElement );
    }

    /**
     * Constructs a new reference object with the ID of a model element that has not yet been loaded.
     * @param id the unique ID of the model element.
     * @param <IElement> the type of model element.
     * @return the new reference.
     */
    public static <IElement extends IModelElement> Ref<IElement> byId( UUID id ) {
        Objects.requireNonNull( id );
        return new Ref<>( id, null );
    }
    
    /**
     * Gets the referenced model element.
     *
     * @return the referenced model element.
     */
    public final IElement get() {
        Objects.requireNonNull( this.modelElement );
        return this.modelElement;
    }

    /**
     * Gets the referenced model element, looking it up by UUID if needed.
     *
     * @param type the type of this Ref
     * @param registry a facility for looking up the referenced model element by UUID if needed.
     * @return the referenced model element.
     */
    public IElement orLoad( Class<IElement> type, IModelElementLookUp registry ) {
        Objects.requireNonNull( this.id );

        if ( this.modelElement == null ) {
            this.modelElement = registry.lookUpModelElementByUuid( type, this.id ).get().get();
        }

        return this.modelElement;
    }

    /**
     * @return the unique ID of the model element.
     */
    public final UUID getId() {
        Objects.requireNonNull( this.id );
        return this.id;
    }

    /**
     * @return whether the value for the referenced ID is loaded in memory.
     */
    public final boolean isLoaded() {
        return this.modelElement != null;
    }

    /**
     * @return whether this is a reference to a missing element.
     */
    public final boolean isMissing() {
        return this.id == null;
    }

    @SuppressWarnings("unchecked")
    private static final Ref MISSING = new Ref( null, null );

    /**
     * The unique ID of the referenced model element.
     */
    private final UUID id;

    /**
     * The referenced model element itself.
     */
    private IElement modelElement;

}
