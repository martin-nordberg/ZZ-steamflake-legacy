package org.steamflake.metamodel.api.elements;

/**
 * Top level base class for Steamflake model entities. Represents any model entity with a summary and a unique ID.
 */
public interface IEntity<ISelf extends IEntity>
    extends IElement<ISelf> {

    /**
     * TODO: join to distinct documentation objects
     *
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
