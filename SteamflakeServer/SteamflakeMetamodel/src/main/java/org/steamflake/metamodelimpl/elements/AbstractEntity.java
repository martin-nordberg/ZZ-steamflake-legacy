package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.Ref;
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
     * @param self            the shared reference to this object from the element registry.
     * @param summary         a short summary of the entity.
     */
    @SuppressWarnings("unchecked")
    protected AbstractEntity( Ref<ISelf> self, String summary ) {
        super( self );

        this.summary = new V<>( summary );

    }

    @Override
    public final String getSummary() {
        return this.summary.get();
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setSummary( String summary ) {
        this.summary.set( summary );
        return (ISelf) this;
    }

    /**
     * A short summary of this entity.
     */
    private final V<String> summary;

}
