package org.steamflake.metamodelimpl.structure.entities;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.structure.entities.INamespace;
import org.steamflake.metamodel.structure.relationships.INamespaceContainment;
import org.steamflake.metamodelimpl.elements.AbstractNamedEntity;
import org.steamflake.metamodelimpl.structure.relationships.NamespaceContainment;
import org.steamflake.utilities.revisions.VSet;

import java.util.Set;
import java.util.UUID;

/**
 * Abstract base class for concrete namespaces.
 */
public abstract class AbstractNamespace<ISelf extends IAbstractNamespace>
    extends AbstractNamedEntity<ISelf>
    implements IAbstractNamespace<ISelf> {

    protected AbstractNamespace( Ref<ISelf> self, String name, String summary ) {
        super( self, name, summary );
        this.namespaceContainmentRelationships = new VSet<>();
    }

    @Override
    public final INamespace makeNamespace( UUID id, String name, String summary ) {
        return new Namespace( this.getSelf().makeRefById( INamespace.class, id ), name, summary );
    }

    @Override
    public Set<? extends INamespaceContainment> getNamespaceContainmentRelationships() {
        return this.namespaceContainmentRelationships.get();
    }

    private final VSet<NamespaceContainment> namespaceContainmentRelationships;

}
