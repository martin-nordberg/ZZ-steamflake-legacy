package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.IFunctionSignature;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.metamodelimpl.elements.AbstractNamedContainerElement;

import java.util.UUID;

/**
 * Abstract base class for implementations of IFunctionSignature.
 */
public abstract class AbstractFunctionSignature<ISelf, IParent extends INamedContainerElement>
    extends AbstractNamedContainerElement<ISelf, IParent>
    implements IFunctionSignature<ISelf, IParent> {

    protected AbstractFunctionSignature( UUID id ) {
        super( id );
    }

    @Override
    public final boolean isExported() {
        return this.getState().isExported;
    }

    @Override
    public final IParameter makeParameter( UUID id, String name, String summary, int sequence ) {
        return new Parameter( id, this, name, summary, sequence );
    }

    @Override
    protected abstract State<IParent> getState();

    /**
     * Class representing the versioned state of a namespace.
     */
    protected static class State<IParent extends INamedContainerElement>
        extends AbstractNamedContainerElement.State<IParent> {

        State( Ref<IParent> parentContainer, String name, String summary, boolean isExported ) {
            super( parentContainer, name, summary );

            this.isExported = isExported;
        }

        public final boolean isExported;
    }

}
