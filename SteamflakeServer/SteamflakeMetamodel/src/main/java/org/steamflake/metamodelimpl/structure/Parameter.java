package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IFunctionSignature;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.metamodelimpl.elements.AbstractNamedElement;
import org.steamflake.utilities.revisions.V;

/**
 * Implementation of IParemeter.
 */
public final class Parameter
    extends AbstractNamedElement<IParameter, IFunctionSignature>
    implements IParameter {

    /**
     * Constructs a new parameter with given attributes.
     *
     * @param self     the registered shared reference to the object.
     * @param parent   the parent function signature of the parameter.
     * @param name     the name of the parameter.
     * @param summary  a summary of the parameter.
     * @param sequence the sequence number of the parameter.
     */
    public Parameter( Ref<IParameter> self, Ref<? extends IFunctionSignature> parent, String name, String summary, int sequence ) {
        super( self, parent, name, summary );
        this.sequence = new V<>( sequence );
    }

    @Override
    public IFunctionSignature getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( IFunctionSignature.class, registry );
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
