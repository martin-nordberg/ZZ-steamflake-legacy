package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.IModule;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Implementation for IModule.
 */
public class Module
    implements IModule {

    /**
     * Constructs a new module with given attributes.
     *
     * @param id       the unique ID of the module.
     * @param parentId the unique ID of the parent namespace of the module.
     * @param name     the name of the module.
     * @param summary  a summary of the module.
     * @param version  the version number of the module.
     */
    public Module( String id, String parentId, String name, String summary, String version ) {
        this.id = UUID.fromString( id );
        this.state = new Ver<>( new State( UUID.fromString( parentId ), null, name, summary, version ) );
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
    public INamespace getParentContainer() {
        return this.state.get().parent;
    }

    @Override
    public String getSummary() {
        return this.state.get().summary;
    }

    @Override
    public String getVersion() {
        return this.state.get().version;
    }

    @Override
    public IModule setName( String name ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentId, oldState.parent, name, oldState.summary, oldState.version ) );
        return this;
    }

    @Override
    public IModule setParentContainer( INamespace parent ) {
        State oldState = this.state.get();
        this.state.set( new State( parent.getId(), parent, oldState.name, oldState.summary, oldState.version ) );
        return this;
    }

    @Override
    public IModule setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentId, oldState.parent, oldState.name, summary, oldState.version ) );
        return this;
    }

    @Override
    public IModule setVersion( String version ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentId, oldState.parent, oldState.name, oldState.summary, version ) );
        return this;
    }

    /**
     * Class representing the versioned state of a module.
     */
    private static class State {

        State( UUID parentId, INamespace parent, String name, String summary, String version ) {
            this.parentId = parentId;
            this.parent = parent;
            this.name = name;
            this.summary = summary;
            this.version = version;
        }

        final String name;

        INamespace parent;

        final UUID parentId;

        final String summary;

        final String version;

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
