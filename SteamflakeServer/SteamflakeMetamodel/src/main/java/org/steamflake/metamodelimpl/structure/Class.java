package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IComponent;
import org.steamflake.metamodel.structure.IParameter;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Implementation of IClass.
 */
public class Class
    implements IClass {

    /**
     * Constructs a new class with given attributes.
     *
     * @param id         the unique ID of the class.
     * @param parentId   the unique ID of the parent namespace of the class.
     * @param name       the name of the class.
     * @param summary    a summary of the class.
     * @param isExported whether this class is accessible outside its parent component.
     */
    public Class( String id, String parentId, String name, String summary, boolean isExported ) {
        this.id = UUID.fromString( id );
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, isExported ) );
    }

    public Class( UUID id, IComponent parent, String name, String summary, boolean isExported ) {
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
        return true;
    }

    @Override
    public IClass makeClass( UUID id, String name, String summary, boolean isExported ) {
        return new Class( id, this, name, summary, isExported );
    }

    @Override
    public IParameter makeParameter( UUID id, String name, String summary, int sequence ) {
        return new Parameter( id, this, name, summary, sequence );
    }

    @Override
    public Ref<IComponent> refParentContainer() {
        return this.state.get().parentContainer;
    }

    @Override
    public IClass setExported( boolean isExported ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, oldState.summary, oldState.isExported ) );
        return this;
    }

    @Override
    public IClass setName( String name ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, name, oldState.summary, oldState.isExported ) );
        return this;
    }

    @Override
    public IClass setParentContainer( IComponent parent ) {
        State oldState = this.state.get();
        this.state.set( new State( new Ref<>( parent.getId(), parent ), oldState.name, oldState.summary, oldState.isExported ) );
        return this;
    }

    @Override
    public IClass setSummary( String summary ) {
        State oldState = this.state.get();
        this.state.set( new State( oldState.parentContainer, oldState.name, summary, oldState.isExported ) );
        return this;
    }

    /**
     * Class representing the versioned state of a module.
     */
    private static class State {

        State( Ref<IComponent> parentContainer, String name, String summary, boolean isExported ) {
            this.parentContainer = parentContainer;
            this.name = name;
            this.summary = summary;
            this.isExported = isExported;
        }

        final boolean isExported;

        final String name;

        final Ref<IComponent> parentContainer;

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
