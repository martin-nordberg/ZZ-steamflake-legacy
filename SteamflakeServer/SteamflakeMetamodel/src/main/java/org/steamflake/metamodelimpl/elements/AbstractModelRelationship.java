package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.IModelRelationship;

/**
 * Abstract base class for relationship implementations.
 */
public abstract class AbstractModelRelationship<IFrom extends IModelElement, ITo extends IModelElement>
    implements IModelRelationship<IFrom, ITo> {

    protected AbstractModelRelationship( IFrom from, ITo to ) {
        this.from = from;
        this.to = to;
    }

    @Override
    public IFrom getFrom() {
        return this.from;
    }

    @Override
    public ITo getTo() {
        return this.to;
    }


    private final IFrom from;

    private final ITo to;

}
