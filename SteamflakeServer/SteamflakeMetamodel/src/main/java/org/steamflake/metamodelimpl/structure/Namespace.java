package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.IModule;
import org.steamflake.metamodel.structure.INamespace;

import java.util.UUID;

/**
 * Namespace implementation.
 */
public final class Namespace
    extends AbstractNamespace<INamespace, IAbstractNamespace>
    implements INamespace {

    /**
     * Constructs a new namespace.
     *
     * @param self    the registered shared reference to the object.
     * @param parent  the parent container of the namespace.
     * @param name    the name of the namespace.
     * @param summary a short summary of the namespace.
     */
    public Namespace( Ref<INamespace> self, Ref<? extends IAbstractNamespace> parent, String name, String summary ) {
        super( self, parent, name, summary );
    }

    @Override
    public IAbstractNamespace getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( IAbstractNamespace.class, registry );
    }

    @Override
    public final IModule makeModule( UUID id, String name, String summary, String version ) {
        return new Module( Ref.byId( id ), this.getSelf(), name, summary, version );
    }

}

