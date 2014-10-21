package org.steamflake.metamodel.api.structure.relationships;

import org.steamflake.metamodel.api.elements.IRelationship;
import org.steamflake.metamodel.api.structure.entities.IModule;

/**
 * Interface to a module dependency.
 */
public interface IModuleDependency
    extends IRelationship<IModuleDependency, IModule, IModule> {

    default IModule getDependedModule() {
        return this.getTo();
    }

    default IModule getDependingModule() {
        return this.getFrom();
    }

    boolean isExported();

}
