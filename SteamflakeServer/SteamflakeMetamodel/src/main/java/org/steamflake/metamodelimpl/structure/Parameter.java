package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IFunctionSignature;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.metamodelimpl.elements.AbstractNamedElement;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Implementation of IParemeter.
 */
public class Parameter
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
        super( UUID.fromString( id ) );
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, sequence ) );
    }

    public Parameter( UUID id, IFunctionSignature parent, String name, String summary, int sequence ) {
        super( id );
        this.state = new Ver<>( new State( new Ref<>( parent.getId(), parent ), name, summary, sequence ) );
    }

    @Override
    protected State getState() {
        return this.state.get();
    }

    @Override
    public int getSequence() {
        return this.state.get().sequence;
    }

    @Override
    public IParameter setName( String name ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, name, oldState.summary, oldState.sequence ) );
        return this;
    }

    @Override
    public IParameter setParentContainer( IFunctionSignature parent ) {
        State oldState = this.state.get();
        this.state.set( new State( new Ref<>( parent.getId(), parent ), oldState.name, oldState.summary, oldState.sequence ) );
        return this;
    }

    @Override
    public IParameter setSequence( int sequence ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, oldState.summary, sequence ) );
        return this;
    }

    @Override
    public IParameter setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, summary, oldState.sequence ) );
        return this;
    }

    /**
     * Class representing the versioned state of a module.
     */
    private static class State
        extends AbstractNamedElement.State<IFunctionSignature>{

        State( Ref<IFunctionSignature> parentContainer, String name, String summary, int sequence ) {
            super( parentContainer, name, summary );
            this.sequence = sequence;
        }

        final int sequence;

    }

    /**
     * The versioned state of this module.
     */
    private final Ver<State> state;

}
