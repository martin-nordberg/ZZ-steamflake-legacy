package org.steamflake.metamodel.structure.relationships;

import org.steamflake.metamodel.elements.IRelationship;
import org.steamflake.metamodel.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.structure.entities.INamespace;

/**
 * Parent/child relationship from abstract namespaces to namespaces.
 */
public interface INamespaceContainment
    extends IRelationship<INamespaceContainment,IAbstractNamespace,INamespace> {

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
