package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IFunctionSignature;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Implementation of IParemeter.
 */
public class Parameter
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
        this.id = UUID.fromString( id );
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, sequence ) );
    }

    public Parameter( UUID id, IFunctionSignature parent, String name, String summary, int sequence ) {
        this.id = id;
        this.state = new Ver<>( new State( new Ref<>( parent.getId(), parent ), name, summary, sequence ) );
    }

    @Override
    public UUID getId() {
        return this.id;
    }

    @Override
    public String getName() {
        return this.state.get().name;
    }

    @Override
    public int getSequence() {
        return this.state.get().sequence;
    }

    @Override
    public String getSummary() {
        return this.state.get().summary;
    }

    @Override
    public Ref<IFunctionSignature> refParentContainer() {
        return this.state.get().parentContainer;
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
    private static class State {

        State( Ref<IFunctionSignature> parentContainer, String name, String summary, int sequence ) {
            this.parentContainer = parentContainer;
            this.name = name;
            this.summary = summary;
            this.sequence = sequence;
        }

        final String name;

        final Ref<IFunctionSignature> parentContainer;

        final int sequence;

        final String summary;

    }

    /**
     * The unique ID of this module.
     */
    private final UUID id;

    /**
     * The versioned state of this module.
     */
    private final Ver<State> state;

}
