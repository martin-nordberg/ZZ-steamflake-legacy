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
     * @param id              the unique ID of the model element.
     * @param parentContainer a reference to the parent container of the element.
     * @param summary         a short summary of the model element.
     */
    @SuppressWarnings("unchecked")
    protected AbstractModelElement( UUID id, Ref<IParent> parentContainer, String summary ) {
        this.id = id;
        this.parentContainer = new V<>( parentContainer );
        this.self = new Ref<>( (ISelf) this );
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

        return id.equals( ((AbstractModelElement) that).id );

    }

    @Override
    public final UUID getId() {
        return this.id;
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
        return id.hashCode();
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setParentContainer( IParent parentContainer ) {
        this.parentContainer.set( new Ref<>( parentContainer ) );
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
     * The unique ID of this model element.
     */
    private final UUID id;

    /**
     * A shareable reference to this object.
     */
    private final Ref<ISelf> self;

    /**
     * A short summary of this model element.
     */
    private final V<String> summary;

}
