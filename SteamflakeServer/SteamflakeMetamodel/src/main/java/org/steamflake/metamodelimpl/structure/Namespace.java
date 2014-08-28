package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Namespace implementation.
 */
public class Namespace
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
        this.id = UUID.fromString( id );
        this.state = new Ver<>( new State( UUID.fromString( parentId ), null, name, summary ) );
    }

    @Override
    public UUID getId() {
        return this.id;
    }

    @Override
    public String getName() {
        return state.get().name;
    }

    @Override
    public IAbstractNamespace getParentContainer() {

        // TBD: initialize the parent reference from the parent UUID

        return state.get().parent;
    }

    @Override
    public UUID getParentId() {
        return this.state.get().parentId;
    }

    @Override
    public String getSummary() {
        return state.get().summary;
    }

    @Override
    public INamespace setName( String name ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentId, oldState.parent, name, oldState.summary ) );
        return this;
    }

    @Override
    public INamespace setParentContainer( IAbstractNamespace parent ) {
        State oldState = this.state.get();
        this.state.set( new State( parent.getId(), parent, oldState.name, oldState.summary ) );
        return this;
    }

    @Override
    public INamespace setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentId, oldState.parent, oldState.name, summary ) );
        return this;
    }

    /**
     * Class representing the versioned state of a namespace.
     */
    private static class State {

        State( UUID parentId, IAbstractNamespace parent, String name, String summary ) {
            this.parentId = parentId;
            this.parent = parent;
            this.name = name;
            this.summary = summary;
        }

        final String name;

        IAbstractNamespace parent;

        final UUID parentId;

        final String summary;

    }

    /**
     * The unique ID of this namespace.
     */
    private final UUID id;

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