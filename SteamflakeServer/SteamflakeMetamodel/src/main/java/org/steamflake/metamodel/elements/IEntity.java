package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * Top level base class for Steamflake model entities. Represents any model entity with a summary and a unique ID.
 */
public interface IEntity<ISelf extends IEntity> {

    /**
     * @return the unique ID of this entity.
     */
    UUID getId();

    /**
     * @return a shareable reference to this entity.
     */
    Ref<ISelf> getSelf();

    /**
     * @return a short summary of this entity.
     */
    String getSummary();

    /**
     * Changes the summary of this entity.
     *
     * @param summary the new summary.
     * @return this entity.
     */
    ISelf setSummary( String summary );

}
