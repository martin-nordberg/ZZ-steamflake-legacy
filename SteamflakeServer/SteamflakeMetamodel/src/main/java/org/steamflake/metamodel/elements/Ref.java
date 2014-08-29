package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * Reference to an object by UUID and ordinary Java reference. Supports lazy loading (or non-loading) of
 * related objects.
 */
public class Ref<T> {

    /**
     * Constructs a reference to a not-yet-loaded object with known UUID.
     *
     * @param id the unique ID of the object.
     */
    public Ref( UUID id ) {
        this( id, null );
    }

    /**
     * Constructs a reference to a loaded object.
     *
     * @param id    the unique ID of the object.
     * @param value the object itself.
     */
    public Ref( UUID id, T value ) {
        this.id = id;
        this.value = value;
    }

    /**
     * @return the unique ID of the object.
     */
    public UUID getId() {
        return this.id;
    }

    /**
     * @return Whether the referenced object has been loaded and is referenceable.
     */
    public boolean isLoaded() {
        return value != null;
    }

    // TBD: return value, lazy loading, Optional-like monad functionality, etc.

    private final UUID id;

    private T value;

}
