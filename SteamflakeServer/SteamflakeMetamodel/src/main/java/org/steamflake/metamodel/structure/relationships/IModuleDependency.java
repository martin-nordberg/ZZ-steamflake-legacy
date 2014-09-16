package org.steamflake.metamodel.structure.relationships;

import org.steamflake.metamodel.elements.IRelationship;
import org.steamflake.metamodel.structure.entities.IModule;

/**
 * Interface to a module dependency.
 */
public interface IModuleDependency
    extends IRelationship<IModule,IModule> {

    default IModule getDependingModule() {
        return this.getFrom();
    }

    default IModule getDependedModule() {
        return this.getTo();
    }

    boolean isExported();

}
