package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.IRelationship;

/**
 * Abstract base class for relationship implementations.
 */
public abstract class AbstractRelationship<IFrom extends IEntity, ITo extends IEntity>
    implements IRelationship<IFrom, ITo> {

    protected AbstractRelationship( IFrom from, ITo to ) {
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
