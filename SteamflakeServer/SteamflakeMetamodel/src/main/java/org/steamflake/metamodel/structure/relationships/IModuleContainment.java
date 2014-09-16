package org.steamflake.metamodel.structure.relationships;

import org.steamflake.metamodel.elements.IModelRelationship;
import org.steamflake.metamodel.structure.entities.IModule;
import org.steamflake.metamodel.structure.entities.INamespace;

/**
 * Relationship for the containment of modules by namespaces.
 */
public interface IModuleContainment
    extends IModelRelationship<INamespace, IModule>
{

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
