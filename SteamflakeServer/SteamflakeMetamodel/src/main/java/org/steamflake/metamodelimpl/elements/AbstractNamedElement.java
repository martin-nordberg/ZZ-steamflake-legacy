package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.INamedElement;
import org.steamflake.metamodel.elements.Ref;

import java.util.UUID;

/**
 * Abstract base class for named model elements
 */
public abstract class AbstractNamedElement<ISelf, IParent extends INamedContainerElement>
    extends AbstractModelElement<ISelf, IParent>
    implements INamedElement<ISelf, IParent> {

    protected AbstractNamedElement( UUID id ) {
        super( id );
    }

    @Override
    public final String getName() {
        return this.getState().name;
    }

    @Override
    protected abstract State<IParent> getState();

    /**
     * Class representing the versioned state of a namespace.
     */
    protected static class State<IParent extends INamedContainerElement>
        extends AbstractModelElement.State<IParent> {

        protected State( Ref<IParent> parentContainer, String name, String summary ) {
            super( parentContainer, summary );
            this.name = name;
        }

        public final String name;

    }

}
