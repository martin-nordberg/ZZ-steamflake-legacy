package org.steamflake.metamodel.actions.elements;

import org.steamflake.metamodel.api.elements.IAction;
import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.INamedEntity;
import org.steamflake.metamodel.api.elements.Ref;

import java.util.UUID;

/**
 * Action to destroy a model element.
 */
public final class DestroyAction
    extends AbstractAction<DestroyAction> {

    /**
     * Constructs a new action to destroy a model element.
     *
     * @param self    the registered reference to the new action.
     * @param element the model element to be destroyed.
     */
    public DestroyAction( Ref<DestroyAction> self, IElement element ) {
        super( self );

        this.element = element;

        if ( element.isDestroyed() ) {
            throw new IllegalStateException( "Element has already been destroyed." );
        }

        element.setDestroyed( true );
    }

    @Override
    public final boolean canReverse() {
        return this.element.isDestroyed();
    }

    @Override
    public final String getDescription() {
        if ( this.element instanceof INamedEntity ) {
            return "Delete " + ((INamedEntity) this.element).getName();
        }
        return "Delete element";
    }

    @Override
    protected final IAction doMakeReversingAction( UUID id ) {
        return new UndestroyAction( this.getSelf().makeRefById( id, UndestroyAction.class ), this.element );
    }

    private final IElement element;

}
