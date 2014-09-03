package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.*;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Implementation for IModule.
 */
public class Module
    extends AbstractPackage<IModule, INamespace>
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
        super( UUID.fromString( id ) );
        this.state = new V<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, version ) );
    }

    public Module( UUID id, INamespace parent, String name, String summary, String version ) {
        super( id );
        this.state = new V<>( new State( new Ref<>( parent.getId(), parent ), name, summary, version ) );
    }

    @Override
    protected State getState() {
        return this.state.get();
    }

    @Override
    public IModule setExported( boolean isExported ) {
        if ( !isExported ) {
            throw new IllegalArgumentException( "A module is always exported." );
        }
        return this;
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
    public String getVersion() {
        return this.state.get().version;
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
    private static class State
        extends AbstractPackage.State<INamespace> {

        State( Ref<INamespace> parentContainer, String name, String summary, String version ) {
            super( parentContainer, name, summary, true );
            this.version = version;
        }

        final String version;

    }

    /**
     * The versioned state of this module.
     */
    private final V<State> state;

}
