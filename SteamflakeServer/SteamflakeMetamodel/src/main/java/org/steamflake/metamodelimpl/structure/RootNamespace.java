package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.utilities.revisions.V;

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
        this.parentContainer = new Ref<>( this.id, this );
        this.state = new V<>( new State( summary ) );
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
    public String getSummary() {
        return this.state.get().summary;
    }

    @Override
    public INamespace makeNamespace( UUID id, String name, String summary ) {
        return new Namespace( id, this, name, summary );
    }

    @Override
    public Ref<IAbstractNamespace> refParentContainer() {
        return this.parentContainer;
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

    private final Ref<IAbstractNamespace> parentContainer;

    /**
     * The versioned state of this root namespace.
     */
    private final V<State> state;

}
