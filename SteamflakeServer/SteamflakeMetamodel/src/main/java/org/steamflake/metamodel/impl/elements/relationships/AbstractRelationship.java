package org.steamflake.metamodel.impl.elements.relationships;

import org.steamflake.metamodel.api.elements.IEntity;
import org.steamflake.metamodel.api.elements.IRelationship;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.impl.elements.AbstractElement;
import org.steamflake.utilities.revisions.V;

/**
 * Abstract base class for relationship implementations.
 */
public abstract class AbstractRelationship<ISelf extends IRelationship, IFrom extends IEntity, ITo extends IEntity>
    extends AbstractElement<ISelf>
    implements IRelationship<ISelf, IFrom, ITo> {

    protected AbstractRelationship( Class<ISelf> selfType, Ref<ISelf> self, IFrom from, ITo to ) {

        super( selfType, self );

        this.from = from;
        this.to = to;

        // TBD: will eventually want to be able to resurrect elements that have been persistently destroyed
        this.destroyed = new V<Boolean>( false );

    }

    @Override
    public IFrom getFrom() {
        return this.from;
    }

    @Override
    public ITo getTo() {
        return this.to;
    }

    @Override
    public final boolean isDestroyed() {
        return this.destroyed.get();
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setDestroyed( boolean destroyed ) {

        if ( destroyed != this.destroyed.get() ) {

            this.destroyed.set( destroyed );

            // TBD: template method to destroy related elements ...

        }

        return (ISelf) this;

    }

    /**
     * Whether this element has been destroyed.
     */
    private final V<Boolean> destroyed;

    private final IFrom from;

    private final ITo to;

}
