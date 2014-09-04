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

    protected AbstractModelElement( UUID id, Ref<IParent> parentContainer, String summary ) {
        this.id = id;
        this.parentContainer = new V<>( parentContainer );
        this.summary = new V<>( summary );
    }

    @Override
    public final UUID getId() {
        return this.id;
    }

    @Override
    public final String getSummary() {
        return this.summary.get();
    }

    @Override
    public final Ref<IParent> refParentContainer() {
        return this.parentContainer.get();
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setParentContainer( IParent parentContainer ) {
        this.parentContainer.set( new Ref<>( parentContainer.getId(), parentContainer ) );
        return (ISelf) this;
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setSummary( String summary ) {
        this.summary.set( summary );
        return (ISelf) this;
    }

    /**
     * The unique ID of this model element.
     */
    private final UUID id;

    /**
     * A reference to the parent container of this model element.
     */
    private final V<Ref<IParent>> parentContainer;

    /**
     * A short summary of this model element.
     */
    private final V<String> summary;

}
