package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * Reference to an object by UUID and ordinary Java reference. Supports lazy loading (or non-loading) of
 * related objects.
 */
public class Ref<T extends IModelElement> {

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
     * Gets the referenced model element, looking it up by UUID if needed.
     *
     * @param registry a facility for looking up the referenced model element by UUID if needed.
     * @return the referenced model element.
     */
    public T get( Class<T> type, IModelElementLookUp registry ) {
        if ( this.modelElement == null ) {
            this.modelElement = registry.lookUpModelElementByUuid( type, this.id ).get();
        }

        return this.modelElement;
    }

    /**
     * @return the unique ID of the model element.
     */
    public UUID getId() {
        return this.id;
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
