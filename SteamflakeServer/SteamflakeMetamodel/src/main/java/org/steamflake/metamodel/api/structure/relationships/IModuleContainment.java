package org.steamflake.metamodel.api.structure.relationships;

import org.steamflake.metamodel.api.elements.IRelationship;
import org.steamflake.metamodel.api.structure.entities.IModule;
import org.steamflake.metamodel.api.structure.entities.INamespace;

/**
 * Relationship for the containment of modules by namespaces.
 */
public interface IModuleContainment
    extends IRelationship<IModuleContainment, INamespace, IModule> {

    /**
     * @return the child module of the relationship.
     */
    default IModule getContainedModule() {
        return this.getTo();
    }

    /**
     * @return the parent namespace of the relationship.
     */
    default INamespace getContainingNamespace() {
        return this.getFrom();
    }


}
