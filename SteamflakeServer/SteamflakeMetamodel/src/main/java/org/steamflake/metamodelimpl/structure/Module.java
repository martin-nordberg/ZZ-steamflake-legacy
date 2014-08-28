package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
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
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString(parentId) ), name, summary, version ) );
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
    public Ref<INamespace> refParentContainer() {
        return this.state.get().parentContainer;
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
        this.state.set( new State( oldState.parentContainer, name, oldState.summary, oldState.version ) );
        return this;
    }

    @Override
    public IModule setParentContainer( INamespace parent ) {
        State oldState = this.state.get();
        this.state.set( new State( new Ref<>( parent.getId(), parent ), oldState.name, oldState.summary, oldState.version ) );
        return this;
    }

    @Override
    public IModule setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, summary, oldState.version ) );
        return this;
    }

    @Override
    public IModule setVersion( String version ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, oldState.summary, version ) );
        return this;
    }

    /**
     * Class representing the versioned state of a module.
     */
    private static class State {

        State( Ref<INamespace> parentContainer, String name, String summary, String version ) {
            this.parentContainer = parentContainer;
            this.name = name;
            this.summary = summary;
            this.version = version;
        }

        final String name;

        final Ref<INamespace> parentContainer;

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
