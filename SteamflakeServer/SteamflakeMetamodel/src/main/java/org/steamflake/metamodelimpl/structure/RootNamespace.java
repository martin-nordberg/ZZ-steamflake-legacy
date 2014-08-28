package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Root namespace implementation.
 */
public class RootNamespace
    implements IRootNamespace {

    /**
     * Constructs a new namespace.
     *
     * @param id      the unique ID of the namespace.
     * @param summary a short summary of the namespace.
     */
    public RootNamespace( String id, String summary ) {
        this.id = UUID.fromString( id );
        this.state = new Ver<>( new State( summary ) );
    }

    @Override
    public UUID getId() {
        return this.id;
    }

    @Override
    public String getName() {
        return "$";
    }

    @Override
    public IAbstractNamespace getParentContainer() {
        return this;
    }

    @Override
    public String getSummary() {
        return this.state.get().summary;
    }

    @Override
    public IRootNamespace setName( String name ) {
        throw new UnsupportedOperationException( "Cannot change the name of the root namespace." );
    }

    @Override
    public IRootNamespace setParentContainer( IAbstractNamespace parent ) {
        throw new UnsupportedOperationException( "Cannot change the parent of the root namespace." );
    }

    @Override
    public IRootNamespace setSummary( String summary ) {
        this.state.set( new State( summary ) );
        return this;
    }

    /**
     * Class representing the versioned state of a root namespace.
     */
    private static class State {

        State( String summary ) {
            this.summary = summary;
        }

        final String summary;

    }

    /**
     * The unique ID of this root namespace.
     */
    private final UUID id;

    /**
     * The versioned state of this root namespace.
     */
    private final Ver<State> state;

}
