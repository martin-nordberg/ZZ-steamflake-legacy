package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Root namespace implementation.
 */
public final class RootNamespace
    implements IRootNamespace {

    /**
     * Constructs a new namespace.
     *
     * @param id      the unique ID of the namespace.
     * @param summary a short summary of the namespace.
     */
    public RootNamespace( String id, String summary ) {
        this.id = UUID.fromString( id );
        this.parentContainer = Ref.to( this );
        this.summary = new V<>( summary );
    }

    @Override
    public final UUID getId() {
        return this.id;
    }

    @Override
    public final String getName() {
        return "$";
    }

    @Override
    public final IRootNamespace getParentContainer( IModelElementLookUp registry ) {
        return this;
    }

    @Override
    public final UUID getParentContainerId() {
        return this.id;
    }

    @Override
    public final Ref<IRootNamespace> getSelf() {
        return parentContainer;
    }

    @Override
    public final String getSummary() {
        return this.summary.get();
    }

    @Override
    public final INamespace makeNamespace( UUID id, String name, String summary ) {
        return new Namespace( id, this.getSelf(), name, summary );
    }

    @Override
    public final IRootNamespace setName( String name ) {
        throw new UnsupportedOperationException( "Cannot change the name of the root namespace." );
    }

    @Override
    public final IRootNamespace setParentContainer( IRootNamespace parent ) {
        throw new UnsupportedOperationException( "Cannot change the parent of the root namespace." );
    }

    @Override
    public final IRootNamespace setSummary( String summary ) {
        this.summary.set( summary );
        return this;
    }

    /**
     * The unique ID of this root namespace.
     */
    private final UUID id;

    /**
     * The "parent" of this root namespace (i.e. the root namespace itself).
     */
    private final Ref<IRootNamespace> parentContainer;

    /**
     * The versioned summary of this root namespace.
     */
    private final V<String> summary;

}
