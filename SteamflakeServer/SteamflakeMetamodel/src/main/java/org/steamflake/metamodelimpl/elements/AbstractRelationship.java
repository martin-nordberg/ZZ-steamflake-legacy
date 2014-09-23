package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.IRelationship;
import org.steamflake.metamodel.elements.Ref;

/**
 * Abstract base class for relationship implementations.
 */
public abstract class AbstractRelationship<ISelf extends IRelationship, IFrom extends IEntity, ITo extends IEntity>
    extends AbstractElement<ISelf>
    implements IRelationship<ISelf, IFrom, ITo> {

    protected AbstractRelationship( Ref<ISelf> self, IFrom from, ITo to ) {
        super( self );

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
