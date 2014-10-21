package org.steamflake.metamodel.actions.elements;

import org.steamflake.metamodel.api.elements.IAction;
import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.INamedEntity;
import org.steamflake.metamodel.api.elements.Ref;

import java.util.UUID;

/**
 * Action to revert the destruction of a model element.
 */
public final class UndestroyAction
    extends AbstractAction<UndestroyAction> {

    /**
     * Constructs a new action to revert the destruction of a given element.
     *
     * @param self    the registered reference to the new action.
     * @param element the element to be destroyed.
     */
    public UndestroyAction( Ref<UndestroyAction> self, IElement element ) {
        super( UndestroyAction.class, self );

        this.element = element;

        if ( !element.isDestroyed() ) {
            throw new IllegalStateException( "Element has not been destroyed." );
        }

        element.setDestroyed( false );
    }

    @Override
    public final boolean canReverse() {
        return !this.element.isDestroyed();
    }

    @Override
    public final String getDescription() {
        if ( this.element instanceof INamedEntity ) {
            return "Undelete " + ((INamedEntity) this.element).getName();
        }
        return "Undelete element";
    }

    @Override
    protected final IAction doMakeReversingAction( UUID id ) {
        return new DestroyAction( this.getSelf().makeRefById( id ), this.element );
    }

    private final IElement element;

}
