package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * The type and look up source for an element reference.
 */
public class RefSource<Element extends IElement> {

    /**
     * Constructs a new element source for given element type from the given store.
     * @param elementType the type of element to find when needed.
     * @param store the store to look in.
     */
    public RefSource( Class<Element> elementType, IElementLookUp store ) {
        this.elementType = elementType;
        this.store = store;
    }

    /**
     * Get the reference source for another kind of element.
     * @param entityType the type of element to be sourced.
     * @param <IOtherElement> the type of element.
     * @return the reference source for the other element type using the same source as this one.
     */
    public final <IOtherElement extends IElement> RefSource<IOtherElement> getSource( Class<IOtherElement> entityType ) {
        return this.store.getRefSource( entityType );
    }

    /**
     * Looks up an element by unique ID.
     * @param id the UUID of the element to find.
     * @return a reference to the element.
     */
    public Ref<Element> lookUpElementByUuid( UUID id ) {
        return this.store.lookUpElementByUuid( this.elementType, id );
    }

    /**
     * The type of element found through this reference source.
     */
    private final Class<Element> elementType;

    /**
     * The store from which elements are found.
     */
    private final IElementLookUp store;

}
