package org.steamflake.metamodel.elements;

/**
 * Interface to a relationship between two entities.
 *
 * @param <IFrom>  the type of the entity on the first side of the link.
 * @param <ITo> the type of entity on the second side of the link.
 */
public interface IRelationship<IFrom extends IEntity, ITo extends IEntity> {

    /**
     * @return the entity on the "from" side of the relationship.
     */
    IFrom getFrom();

    /**
     * @return the entity on the "to" side of the relationship.
     */
    ITo getTo();

}
