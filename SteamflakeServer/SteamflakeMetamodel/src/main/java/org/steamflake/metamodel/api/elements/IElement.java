package org.steamflake.metamodel.api.elements;

import java.util.UUID;

/**
 * Highest level element - either an entity or a relationship.
 */
public interface IElement<ISelf extends IElement> {

    /**
     * @return the unique ID of this entity.
     */
    UUID getId();

    /**
     * @return a shareable reference to this entity.
     */
    Ref<ISelf> getSelf();

    /**
     * @return whether this element has been destroyed.
     */
    boolean isDestroyed();

    /**
     * Destroy or undestroy this element.
     *
     * @param destroyed true to destroy the element, false to revert its destruction.
     * @return the element itself.
     */
    ISelf setDestroyed( boolean destroyed );

}
