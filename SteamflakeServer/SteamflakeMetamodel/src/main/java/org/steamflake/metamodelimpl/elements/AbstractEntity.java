package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Abstract base class for classes implementing IEntity.
 */
public abstract class AbstractEntity<ISelf extends IEntity>
    implements IEntity<ISelf> {

    /**
     * Constructs a new entity.
     *
     * @param self            the shared reference to this object from the element registry.
     * @param summary         a short summary of the entity.
     */
    @SuppressWarnings("unchecked")
    protected AbstractEntity( Ref<ISelf> self, String summary ) {

        this.self = self.set( (ISelf) this );
        this.summary = new V<>( summary );

    }

    @SuppressWarnings("SimplifiableIfStatement")
    @Override
    public final boolean equals( Object that ) {

        if ( this == that ) {
            return true;
        }

        if ( that == null || getClass() != that.getClass() ) {
            return false;
        }

        return self.getId().equals( ((AbstractEntity) that).self.getId() );

    }

    @Override
    public final UUID getId() {
        return this.self.getId();
    }

    @Override
    public final Ref<ISelf> getSelf() {
        return this.self;
    }

    @Override
    public final String getSummary() {
        return this.summary.get();
    }

    @Override
    public final int hashCode() {
        return this.self.getId().hashCode();
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setSummary( String summary ) {
        this.summary.set( summary );
        return (ISelf) this;
    }

    /**
     * A shareable reference to this object.
     */
    private final Ref<ISelf> self;

    /**
     * A short summary of this entity.
     */
    private final V<String> summary;

}
