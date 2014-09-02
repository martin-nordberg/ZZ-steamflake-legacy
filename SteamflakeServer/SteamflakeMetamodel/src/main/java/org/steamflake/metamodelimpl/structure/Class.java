package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IComponent;
import org.steamflake.utilities.revisions.Ver;

import java.util.UUID;

/**
 * Implementation of IClass.
 */
public class Class
    extends AbstractComponent<IClass, IComponent>
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
        super( UUID.fromString( id ) );
        this.state = new Ver<>( new State( new Ref<>( UUID.fromString( parentId ) ), name, summary, isExported ) );
    }

    public Class( UUID id, IComponent parent, String name, String summary, boolean isExported ) {
        super( id );
        this.state = new Ver<>( new State( new Ref<>( parent.getId(), parent ), name, summary, isExported ) );
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

    @Override
    protected State getState() {
        return this.state.get();
    }

    /**
     * Class representing the versioned state of a namespace.
     */
    private final static class State
        extends AbstractComponent.State<IComponent> {

        State( Ref<IComponent> parentContainer, String name, String summary, boolean isExported ) {
            super( parentContainer, name, summary, isExported );
        }

    }

    /**
     * The versioned state of this module.
     */
    private final Ver<State> state;

}
