package org.steamflake.metamodel.actions.structure;

import org.steamflake.metamodel.actions.elements.AbstractAction;
import org.steamflake.metamodel.actions.elements.DestroyAction;
import org.steamflake.metamodel.api.elements.IAction;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.api.structure.entities.INamespace;

import java.util.UUID;

/**
 * Action to create a new namespace.
 */
public final class CreateNamespaceAction
    extends AbstractAction<CreateNamespaceAction> {

    /**
     * Constructs a new namespace creation action.
     *
     * @param self    the shared reference to this object from the element registry.
     * @param id      the unique ID of the new namespace
     * @param name    the name of the new namespace
     * @param summary a short summary for the new namesapce
     */
    public CreateNamespaceAction( Ref<CreateNamespaceAction> self, IAbstractNamespace parentNamespace, UUID id, String name, String summary ) {
        super( self );
        this.newNamespace = parentNamespace.makeNamespace( id, name, summary );
    }

    @Override
    public final boolean canReverse() {
        return !this.newNamespace.isDestroyed();
    }

    @Override
    public final IAction doMakeReversingAction( UUID id ) {
        return new DestroyAction( this.getSelf().makeRefById( id, DestroyAction.class ), this.newNamespace );
    }

    @Override
    public final String getDescription() {
        return "Create namespace " + this.newNamespace.getName();
    }

    /**
     * @return the new namespace created by this action.
     */
    public final INamespace getNewNamespace() {
        return newNamespace;
    }

    private final INamespace newNamespace;

}
