package org.steamflake.metamodel.actions.elements;

import org.steamflake.metamodel.api.elements.IAction;
import org.steamflake.metamodel.api.elements.INamedEntity;
import org.steamflake.metamodel.api.elements.Ref;

import java.util.Objects;
import java.util.UUID;

/**
 * Action that renames a named entity.
 */
public final class RenameAction
    extends AbstractAction<RenameAction> {

    /**
     * Constructs a new rename action.
     *
     * @param namedEntity the entity to rename.
     * @param newName     the new name of the entity.
     */
    public RenameAction( Ref<RenameAction> self, INamedEntity namedEntity, String newName ) {

        super( RenameAction.class, self );

        Objects.requireNonNull( namedEntity );
        Objects.requireNonNull( newName );

        this.namedEntity = namedEntity;
        this.newName = newName;
        this.oldName = namedEntity.getName();

        namedEntity.setName( newName );

    }

    @Override
    public final boolean canReverse() {
        return this.namedEntity.getName().equals( newName );
    }

    @Override
    public final String getDescription() {
        return "Rename " + this.oldName + " to " + this.newName;
    }

    @Override
    protected final IAction<RenameAction> doMakeReversingAction( UUID id ) {
        return new RenameAction( this.getSelf().makeRefById( id ), this.namedEntity, this.oldName );
    }

    private final INamedEntity namedEntity;

    private final String newName;

    private final String oldName;

}
