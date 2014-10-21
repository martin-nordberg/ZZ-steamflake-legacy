package org.steamflake.metamodel.api.structure.relationships;

import org.steamflake.metamodel.api.elements.IRelationship;
import org.steamflake.metamodel.api.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.api.structure.entities.INamespace;

/**
 * Parent/child relationship from abstract namespaces to namespaces.
 */
public interface INamespaceContainment
    extends IRelationship<INamespaceContainment, IAbstractNamespace, INamespace> {

    /**
     * @return the child namespace of the relationship.
     */
    default INamespace getContainedNamespace() {
        return this.getTo();
    }

    /**
     * @return the parent namespace of the relationship.
     */
    default IAbstractNamespace getContainingNamespace() {
        return this.getFrom();
    }

}
