package org.steamflake.metamodel.elements;

import java.util.Set;

/**
 * Interface to a one-to-many relationship.
 *
 * @param <IFrom>  the type of the element on the first side of the link.
 * @param <ITo> the type of element on the second side of the link.
 */
public interface IModelRelationship<IFrom extends IModelElement, ITo extends IModelElement> {

    /**
     * @return the model element on the "from" side of the relationship.
     */
    IFrom getFrom();

    /**
     * @return the model element on the "to" side of the relationship.
     */
    ITo getTo();

}
