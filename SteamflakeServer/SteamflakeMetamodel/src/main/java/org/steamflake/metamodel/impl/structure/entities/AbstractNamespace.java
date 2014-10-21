package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.api.structure.entities.INamespace;
import org.steamflake.metamodel.api.structure.relationships.INamespaceContainment;
import org.steamflake.metamodel.impl.elements.entities.AbstractNamedEntity;
import org.steamflake.metamodel.impl.structure.relationships.NamespaceContainment;
import org.steamflake.utilities.revisions.VSet;

import java.util.Set;
import java.util.UUID;

/**
 * Abstract base class for concrete namespaces.
 */
public abstract class AbstractNamespace<ISelf extends IAbstractNamespace>
    extends AbstractNamedEntity<ISelf>
    implements IAbstractNamespace<ISelf> {

    protected AbstractNamespace( java.lang.Class<ISelf> selfType, Ref<ISelf> self, String name, String summary ) {
        super( selfType, self, name, summary );
        this.namespaceContainmentRelationships = new VSet<>();
    }

    @Override
    public Set<? extends INamespaceContainment> getNamespaceContainmentRelationships() {
        return this.namespaceContainmentRelationships.get();
    }

    @Override
    public final INamespace makeNamespace( UUID id, String name, String summary ) {
        return new Namespace( this.getSelf().makeRefById( id ), name, summary );
    }

    private final VSet<NamespaceContainment> namespaceContainmentRelationships;

}
