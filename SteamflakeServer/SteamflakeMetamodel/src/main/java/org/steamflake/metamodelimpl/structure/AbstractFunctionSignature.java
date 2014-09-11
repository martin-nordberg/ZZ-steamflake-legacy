package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IFunctionSignature;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.metamodelimpl.elements.AbstractNamedContainerElement;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Abstract base class for implementations of IFunctionSignature.
 */
public abstract class AbstractFunctionSignature<ISelf extends IFunctionSignature, IParent extends INamedContainerElement>
    extends AbstractNamedContainerElement<ISelf, IParent>
    implements IFunctionSignature<ISelf, IParent> {

    protected AbstractFunctionSignature( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String name, String summary, boolean isExported ) {
        super( self, parentContainer, name, summary );
        this.isExported = new V<>( isExported );
    }

    @Override
    public final boolean isExported() {
        return this.isExported.get();
    }

    @Override
    public final IParameter makeParameter( UUID id, String name, String summary, int sequence ) {
        return new Parameter( Ref.byId( id ), this.getSelf(), name, summary, sequence );
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setExported( boolean isExported ) {
        this.isExported.set( isExported );
        return (ISelf) this;
    }

    private final V<Boolean> isExported;

}
