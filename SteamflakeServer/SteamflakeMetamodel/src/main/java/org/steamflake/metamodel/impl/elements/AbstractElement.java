package org.steamflake.metamodel.impl.elements;

import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.Ref;

import java.util.UUID;

/**
 * Base class for all model elements.
 */
public abstract class AbstractElement<ISelf extends IElement>
    implements IElement<ISelf> {

    /**
     * Constructs a new element.
     *
     * @param selfType the type of this element.
     * @param self     the shared reference to this object from the element registry.
     */
    @SuppressWarnings("unchecked")
    protected AbstractElement( Class<ISelf> selfType, Ref<ISelf> self ) {

        this.self = self.set( selfType, (ISelf) this );

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
