package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IParameter;
import org.steamflake.metamodel.impl.elements.entities.AbstractNamedEntity;
import org.steamflake.utilities.revisions.V;

/**
 * Implementation of IParemeter.
 */
public final class Parameter
    extends AbstractNamedEntity<IParameter>
    implements IParameter {

    /**
     * Constructs a new parameter with given attributes.
     *
     * @param self     the registered shared reference to the object.
     * @param name     the name of the parameter.
     * @param summary  a summary of the parameter.
     * @param sequence the sequence number of the parameter.
     */
    public Parameter( Ref<IParameter> self, String name, String summary, int sequence ) {
        super( IParameter.class, self, name, summary );
        this.sequence = new V<>( sequence );
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
