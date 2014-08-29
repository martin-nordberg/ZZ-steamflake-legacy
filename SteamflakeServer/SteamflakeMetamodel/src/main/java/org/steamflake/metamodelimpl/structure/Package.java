package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractPackage;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IPackage;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Implementation of IPackage.
 */
public class Package
    implements IPackage {

    /**
     * Constructs a new package with given attributes.
     *
     * @param id         the unique ID of the package.
     * @param parentId   the unique ID of the parent package of the new package.
     * @param name       the name of the package.
     * @param summary    a summary of the package.
     * @param isExported whether the new package is visible outside this one.
     */
    public Package( String id, String parentId, String name, String summary, boolean isExported ) {
        this.id = UUID.fromString( id );
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, isExported ) );
    }

    public Package( UUID id, IAbstractPackage parent, String name, String summary, boolean isExported ) {
        this.id = id;
        this.state = new Ver<>( new State( new Ref<>( parent.getId(), parent ), name, summary, isExported ) );
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
    public String getSummary() {
        return this.state.get().summary;
    }

    @Override
    public boolean isExported() {
        return this.state.get().isExported;
    }

    @Override
    public IClass makeClass( UUID id, String name, String summary, boolean isExported ) {
        return new Class( id, this, name, summary, isExported );
    }

    @Override
    public IPackage makePackage( UUID id, String name, String summary, boolean isExported ) {
        return new Package( id, this, name, summary, isExported );
    }

    @Override
    public IParameter makeParameter( UUID id, String name, String summary, int sequence ) {
        return new Parameter( id, this, name, summary, sequence );
    }

    @Override
    public Ref<IAbstractPackage> refParentContainer() {
        return this.state.get().parentContainer;
    }

    @Override
    public IPackage setExported( boolean isExported ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, oldState.summary, isExported ) );
        return this;
    }

    @Override
    public IPackage setName( String name ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, name, oldState.summary, oldState.isExported ) );
        return this;
    }

    @Override
    public IPackage setParentContainer( IAbstractPackage parent ) {
        State oldState = this.state.get();
        this.state.set( new State( new Ref<>( parent.getId(), parent ), oldState.name, oldState.summary, oldState.isExported ) );
        return this;
    }

    @Override
    public IPackage setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, summary, oldState.isExported ) );
        return this;
    }

    /**
     * Class representing the versioned state of a module.
     */
    private static class State {

        State( Ref<IAbstractPackage> parentContainer, String name, String summary, boolean isExported ) {
            this.parentContainer = parentContainer;
            this.name = name;
            this.summary = summary;
            this.isExported = isExported;
        }

        final boolean isExported;

        final String name;

        final Ref<IAbstractPackage> parentContainer;

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
