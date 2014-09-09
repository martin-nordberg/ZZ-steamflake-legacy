package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IFunctionSignature;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.metamodelimpl.elements.AbstractNamedElement;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Implementation of IParemeter.
 */
public final class Parameter
    extends AbstractNamedElement<IParameter, IFunctionSignature>
    implements IParameter {

    /**
     * Constructs a new parameter with given attributes.
     *
     * @param id       the unique ID of the parameter.
     * @param parentId the unique ID of the parent namespace of the parameter.
     * @param name     the name of the parameter.
     * @param summary  a summary of the parameter.
     * @param sequence the sequence number of the parameter.
     */
    public Parameter( String id, String parentId, String name, String summary, int sequence ) {
        super( UUID.fromString( id ), Ref.byId( UUID.fromString( parentId ) ), name, summary );
        this.sequence = new V<>( sequence );
    }

    public Parameter( UUID id, Ref<? extends IFunctionSignature> parent, String name, String summary, int sequence ) {
        super( id, parent, name, summary );
        this.sequence = new V<>( sequence );
    }

    @Override
    public IFunctionSignature getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLoad( IFunctionSignature.class, registry );
    }

    @Override
    public final int getSequence() {
        return this.sequence.get();
    }

    @Override
    public final IParameter setSequence( int sequence ) {
        this.sequence.set( sequence );
        return this;
    }

    /**
     * Class representing the versioned state of a module.
     */
    private final V<Integer> sequence;

}
