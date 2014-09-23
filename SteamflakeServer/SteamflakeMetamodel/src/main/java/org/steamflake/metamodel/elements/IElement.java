package org.steamflake.metamodel.elements;

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

}
