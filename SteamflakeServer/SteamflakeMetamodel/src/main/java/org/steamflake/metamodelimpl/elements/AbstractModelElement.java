package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Abstract base class for classes implementing IModelElement.
 */
public abstract class AbstractModelElement<ISelf extends IModelElement>
    implements IModelElement<ISelf> {

    /**
     * Constructs a new model element.
     *
     * @param self            the shared reference to this object from the element registry.
     * @param summary         a short summary of the model element.
     */
    @SuppressWarnings("unchecked")
    protected AbstractModelElement( Ref<ISelf> self, String summary ) {

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

        return self.getId().equals( ((AbstractModelElement) that).self.getId() );

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
     * A short summary of this model element.
     */
    private final V<String> summary;

}
