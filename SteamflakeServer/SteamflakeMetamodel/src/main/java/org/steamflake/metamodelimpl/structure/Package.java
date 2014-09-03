package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractPackage;
import org.steamflake.metamodel.structure.IPackage;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Implementation of IPackage.
 */
public class Package
    extends AbstractPackage<IPackage, IAbstractPackage>
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
        super( UUID.fromString( id ) );
        this.state = new V<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, isExported ) );
    }

    public Package( UUID id, IAbstractPackage parent, String name, String summary, boolean isExported ) {
        super( id );
        this.state = new V<>( new State( new Ref<>( parent.getId(), parent ), name, summary, isExported ) );
    }

    @Override
    protected State getState() {
        return this.state.get();
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
    private static class State
        extends AbstractPackage.State<IAbstractPackage> {

        State( Ref<IAbstractPackage> parentContainer, String name, String summary, boolean isExported ) {
            super( parentContainer, name, summary, isExported );
        }

    }

    /**
     * The versioned state of this module.
     */
    private final V<State> state;

}
