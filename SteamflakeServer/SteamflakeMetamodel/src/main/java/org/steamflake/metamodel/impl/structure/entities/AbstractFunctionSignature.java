package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IFunctionSignature;
import org.steamflake.metamodel.api.structure.entities.IParameter;
import org.steamflake.metamodel.impl.elements.entities.AbstractNamedEntity;

import java.util.UUID;

/**
 * Abstract base class for implementations of IFunctionSignature.
 */
public abstract class AbstractFunctionSignature<ISelf extends IFunctionSignature>
    extends AbstractNamedEntity<ISelf>
    implements IFunctionSignature<ISelf> {

    protected AbstractFunctionSignature( Ref<ISelf> self, String name, String summary ) {
        super( self, name, summary );
    }

    @Override
    public final IParameter makeParameter( UUID id, String name, String summary, int sequence ) {
        return new Parameter( this.getSelf().makeRefById( id, IParameter.class ), name, summary, sequence );
    }

}
