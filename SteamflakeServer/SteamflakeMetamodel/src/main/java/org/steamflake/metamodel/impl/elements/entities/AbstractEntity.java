package org.steamflake.metamodel.impl.elements.entities;

import org.steamflake.metamodel.api.elements.IEntity;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.impl.elements.AbstractElement;
import org.steamflake.utilities.revisions.V;

/**
 * Abstract base class for classes implementing IEntity.
 */
public abstract class AbstractEntity<ISelf extends IEntity>
    extends AbstractElement<ISelf>
    implements IEntity<ISelf> {

    /**
     * Constructs a new entity.
     *
     * @param self    the shared reference to this object from the element registry.
     * @param summary a short summary of the entity.
     */
    @SuppressWarnings("unchecked")
    protected AbstractEntity( Ref<ISelf> self, String summary ) {
        super( self );

        this.summary = new V<>( summary );

        // TBD: will eventually want to be able to resurrect elements that have been persistently destroyed
        this.destroyed = new V<>( false );

    }

    @Override
    public final String getSummary() {
        return this.summary.get();
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

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setSummary( String summary ) {
        this.summary.set( summary );
        return (ISelf) this;
    }

    /**
     * Whether this element has been destroyed.
     */
    private final V<Boolean> destroyed;

    /**
     * A short summary of this entity.
     */
    private final V<String> summary;

}
