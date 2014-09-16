package org.steamflake.metamodelimpl.structure.entities;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.structure.entities.IModule;
import org.steamflake.metamodel.structure.entities.INamespace;
import org.steamflake.metamodel.structure.relationships.IModuleContainment;
import org.steamflake.metamodel.structure.relationships.INamespaceContainment;

import java.util.Set;
import java.util.UUID;

/**
 * Namespace implementation.
 */
public final class Namespace
    extends AbstractNamespace<INamespace>
    implements INamespace {

    /**
     * Constructs a new namespace.
     *
     * @param self    the registered shared reference to the object.
     * @param name    the name of the namespace.
     * @param summary a short summary of the namespace.
     */
    public Namespace( Ref<INamespace> self, String name, String summary ) {
        super( self, name, summary );
    }

    @Override
    public final Set<? extends IModuleContainment> getModuleContainmentRelationships() {
        return null;  // TODO
    }

    @Override
    public final INamespaceContainment getNamespaceContainmentRelationship() {
        return null; // TODO
    }

    @Override
    public final IModule makeModule( UUID id, String name, String summary, String version ) {
        return new Module( this.getSelf().makeRefById( IModule.class, id ), name, summary, version );
    }

    @Override
    public final INamespace moveToNewContainingNamespace( IAbstractNamespace containingNamespace ) {
        // TODO
        return this;
    }

}

