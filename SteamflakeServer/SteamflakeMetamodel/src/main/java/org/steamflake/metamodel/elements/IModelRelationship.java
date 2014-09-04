package org.steamflake.metamodel.elements;

import java.util.List;

/**
 * Interface to a one-to-many relationship.
 *
 * @param <IOne>  the type of the element on the one side of the link.
 * @param <IMany> the type of elements in the many side of the link.
 */
public interface IModelRelationship<IOne extends IModelElement, IMany extends IModelElement> {

    List<IMany> getMany();

    IOne getOne();

}
