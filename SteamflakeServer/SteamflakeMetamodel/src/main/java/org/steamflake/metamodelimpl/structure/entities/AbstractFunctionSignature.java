package org.steamflake.metamodelimpl.structure.entities;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.entities.IFunctionSignature;
import org.steamflake.metamodel.structure.entities.IParameter;
import org.steamflake.metamodelimpl.elements.AbstractNamedElement;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Abstract base class for implementations of IFunctionSignature.
 */
public abstract class AbstractFunctionSignature<ISelf extends IFunctionSignature>
    extends AbstractNamedElement<ISelf>
    implements IFunctionSignature<ISelf> {

    protected AbstractFunctionSignature( Ref<ISelf> self, String name, String summary ) {
        super( self, name, summary );
    }

    @Override
    public final IParameter makeParameter( UUID id, String name, String summary, int sequence ) {
        return new Parameter( Ref.byId( id ), name, summary, sequence );
    }

}
