package org.steamflake.metamodelimpl.structure.relationships;

import org.steamflake.metamodel.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.structure.entities.INamespace;
import org.steamflake.metamodel.structure.relationships.INamespaceContainment;
import org.steamflake.metamodelimpl.elements.AbstractRelationship;

/**
 * Concrete implementation of namespace containment relationship.
 */
public class NamespaceContainment
    extends AbstractRelationship<IAbstractNamespace,INamespace>
    implements INamespaceContainment {

    protected NamespaceContainment( IAbstractNamespace containingNamespace, INamespace containedNamespace ) {
        super( containingNamespace, containedNamespace );
    }

}
