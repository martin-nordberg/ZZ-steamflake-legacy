package org.steamflake.metamodel.elements;

import java.util.Objects;
import java.util.UUID;

/**
 * Reference to an object by UUID and ordinary Java reference. Supports lazy loading (or non-loading) of
 * related objects.
 */
public final class Ref<T extends IModelElement> {

    // TBD: Combine in the functionality of Optional

    /**
     * Constructs a reference to a not-yet-loaded model element with known UUID.
     *
     * @param id the unique ID of the model element.
     */
    public Ref( UUID id ) {
        this.id = id;
        this.modelElement = null;
    }

    /**
     * Constructs a reference to an already loaded model element.
     *
     * @param modelElement the object itself.
     */
    public Ref( T modelElement ) {
        this.id = modelElement.getId();
        this.modelElement = modelElement;
    }

    /**
     * Gets the referenced model element.
     *
     * @return the referenced model element.
     */
    public final T get() {
        Objects.requireNonNull( this.modelElement );
        return this.modelElement;
    }

    /**
     * Gets the referenced model element, looking it up by UUID if needed.
     *
     * @param registry a facility for looking up the referenced model element by UUID if needed.
     * @return the referenced model element.
     */
    public T get( Class<T> type, IModelElementLookUp registry ) {
        if ( this.modelElement == null ) {
            this.modelElement = registry.lookUpModelElementByUuid( type, this.id ).get().get();
        }

        return this.modelElement;
    }

    /**
     * @return the unique ID of the model element.
     */
    public final UUID getId() {
        return this.id;
    }

    /**
     * @return whether the value for the referenced ID is loaded in memory.
     */
    public final boolean isLoaded() {
        return this.modelElement != null;
    }

    /**
     * Loads the value of this reference.
     * @param modelElement the loaded model element.
     */
    public final void load( T modelElement ) {
        if ( this.modelElement != null ) {
            throw new IllegalStateException( "Cannot load a model element reference more than once." );
        }
        this.modelElement = modelElement;
    }

    /**
     * The unique ID of the referenced model element.
     */
    private final UUID id;

    /**
     * The referenced model element itself.
     */
    private T modelElement;

}
