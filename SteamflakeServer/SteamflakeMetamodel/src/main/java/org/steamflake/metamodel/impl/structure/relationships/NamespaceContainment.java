package org.steamflake.metamodel.impl.structure.relationships;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.api.structure.entities.INamespace;
import org.steamflake.metamodel.api.structure.relationships.INamespaceContainment;
import org.steamflake.metamodel.impl.elements.relationships.AbstractRelationship;

/**
 * Concrete implementation of namespace containment relationship.
 */
public class NamespaceContainment
    extends AbstractRelationship<INamespaceContainment, IAbstractNamespace, INamespace>
    implements INamespaceContainment {

    public NamespaceContainment( Ref<INamespaceContainment> self, Ref<IAbstractNamespace> containingNamespace, Ref<INamespace> containedNamespace ) {
        super( self, containingNamespace, containedNamespace );
    }

}
