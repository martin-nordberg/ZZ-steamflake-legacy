package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IContainerElement;
import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;

import java.util.UUID;

/**
 * Abstract base class for classes implementing IModelElement.
 */
public abstract class AbstractModelElement<ISelf, IParent extends IContainerElement>
    implements IModelElement<ISelf, IParent> {

    protected AbstractModelElement( UUID id ) {
        this.id = id;
    }

    @Override
    public final UUID getId() {
        return this.id;
    }

    @Override
    public final String getSummary() {
        return this.getState().summary;
    }

    @Override
    public final Ref<IParent> refParentContainer() {
        return getState().parentContainer;
    }

    /**
     * Returns the versioned state of this model element.
     *
     * @return a versioned reference to the current state of the model element.
     */
    protected abstract State<IParent> getState();

    /**
     * Class representing the versioned state of a namespace.
     */
    protected static class State<IParent extends IContainerElement> {

        protected State( Ref<IParent> parentContainer, String summary ) {
            this.parentContainer = parentContainer;
            this.summary = summary;
        }

        public final Ref<IParent> parentContainer;

        public final String summary;

    }

    /**
     * The unique ID of this namespace.
     */
    private final UUID id;

}
