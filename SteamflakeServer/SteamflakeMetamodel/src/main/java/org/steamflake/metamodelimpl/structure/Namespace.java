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
     * @param id       the unique ID of the namespace.
     * @param parentId the unique ID of the parent container of this namespace.
     * @param name     the name of the namespace.
     * @param summary  a short summary of the namespace.
     */
    public Namespace( UUID id, String parentId, String name, String summary ) {
        super( id, Ref.byId( UUID.fromString( parentId ) ), name, summary );
    }

    public Namespace( UUID id, Ref<? extends IAbstractNamespace> parent, String name, String summary ) {
        super( id, parent, name, summary );
    }

    @Override
    public IAbstractNamespace getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( IAbstractNamespace.class, registry );
    }

    @Override
    public final IModule makeModule( UUID id, String name, String summary, String version ) {
        return new Module( id, this.getSelf(), name, summary, version );
    }

}

