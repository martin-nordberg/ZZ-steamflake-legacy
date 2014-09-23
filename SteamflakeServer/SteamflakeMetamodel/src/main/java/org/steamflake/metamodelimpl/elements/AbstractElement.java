package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IElement;
import org.steamflake.metamodel.elements.Ref;

import java.util.UUID;

/**
 * Base class for entities and relationships.
 */
public class AbstractElement<ISelf extends IElement>
    implements IElement<ISelf> {

    /**
     * Constructs a new entity.
     *
     * @param self            the shared reference to this object from the element registry.
     */
    @SuppressWarnings("unchecked")
    protected AbstractElement( Ref<ISelf> self ) {

        this.self = self.set( (ISelf) this );

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

        return self.getId().equals( ((AbstractElement) that).self.getId() );

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
    public final int hashCode() {
        return this.self.getId().hashCode();
    }

    /**
     * A shareable reference to this object.
     */
    private final Ref<ISelf> self;

}
