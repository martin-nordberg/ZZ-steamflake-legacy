package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.IModule;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Namespace implementation.
 */
public final class Namespace
    extends AbstractNamespace<INamespace>
    implements INamespace {

    /**
     * Constructs a new namespace.
     *
     * @param id       the unique ID of the namespace.
     * @param parentId the unique ID of the parent container of this namespace.
     * @param name     the name of the namespace.
     * @param summary  a short summary of the namespace.
     */
    public Namespace( String id, String parentId, String name, String summary ) {
        super( UUID.fromString( id ) );
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary ) );
    }

    public Namespace( UUID id, IAbstractNamespace parent, String name, String summary ) {
        super( id );
        this.state = new Ver<>( new State( new Ref<>( parent.getId(), parent ), name, summary ) );
    }

    @Override
    public final IModule makeModule( UUID id, String name, String summary, String version ) {
        return new Module( id, this, name, summary, version );
    }

    @Override
    public final INamespace setName( String name ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, name, oldState.summary ) );
        return this;
    }

    @Override
    public final INamespace setParentContainer( IAbstractNamespace parent ) {
        State oldState = this.state.get();
        this.state.set( new State( new Ref<>( parent.getId(), parent ), oldState.name, oldState.summary ) );
        return this;
    }

    @Override
    public final INamespace setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, summary ) );
        return this;
    }

    @Override
    protected final State getState() {
        return this.state.get();
    }

    /**
     * Class representing the versioned state of a namespace.
     */
    private final static class State
        extends AbstractNamespace.State<IAbstractNamespace> {

        State( Ref<IAbstractNamespace> parentContainer, String name, String summary ) {
            super( parentContainer, name, summary );
        }

    }

    /**
     * The versioned state of this namespace.
     */
    private final Ver<State> state;

}

/***
 IDEAS
 -----


 Namespace extends INamespace
 - UUID constant
 - parent UUID constant
 - parent reference (resolved)
 - constructor takes UUID, parent UUID, attributes
 - Ver<NamespaceAttr> attributes
 - changeable attributes delegate to this.attributes.get/set

 NamespaceAttr
 - all attributes final fields
 - setters return a new whole object with one attribute changed

 Transaction.getVersionedItemsRead - use this list to determine the inputs to a computed output for reactive programming
 ***/