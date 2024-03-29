package org.steamflake.metamodel.api.elements;

import java.util.UUID;


/**
 * Interface to a facility for finding entities and relationships by entity UUID.
 */
public interface IElementLookUp {

    /**
     * Finds the element with given UUID.
     *
     * @param elementType the type of entity to find.
     * @param id          the unique ID of the element to find.
     * @param <Element>   the type of element to find.
     * @return the element found or Ref.missing() if not registered.
     */
    <Element extends IElement> Ref<Element> lookUpElementByUuid( Class<Element> elementType, UUID id );

}
