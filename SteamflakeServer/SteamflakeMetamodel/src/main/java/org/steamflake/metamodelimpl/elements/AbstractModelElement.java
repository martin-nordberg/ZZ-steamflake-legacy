package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IContainerElement;
import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Abstract base class for classes implementing IModelElement.
 */
public abstract class AbstractModelElement<ISelf extends IModelElement, IParent extends IContainerElement>
    implements IModelElement<ISelf, IParent> {

    /**
     * Constructs a new model element.
     *
     * @param self            the shared reference to this object from the element registry.
     * @param parentContainer a reference to the parent container of the element.
     * @param summary         a short summary of the model element.
     */
    @SuppressWarnings("unchecked")
    protected AbstractModelElement( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String summary ) {

        this.parentContainer = new V<>( (Ref<IParent>) parentContainer );
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
    public final UUID getParentContainerId() {
        return this.parentContainer.get().getId();
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
    public final ISelf setParentContainer( IParent parentContainer ) {
        this.parentContainer.set( parentContainer.getSelf() );
        return (ISelf) this;
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setSummary( String summary ) {
        this.summary.set( summary );
        return (ISelf) this;
    }

    /**
     * A reference to the parent container of this model element.
     */
    protected final V<Ref<IParent>> parentContainer;

    /**
     * A shareable reference to this object.
     */
    private final Ref<ISelf> self;

    /**
     * A short summary of this model element.
     */
    private final V<String> summary;

}
