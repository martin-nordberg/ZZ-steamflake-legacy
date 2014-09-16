package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.structure.relationships.IModuleContainment;
import org.steamflake.metamodel.structure.relationships.IModuleDependency;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * A module is a deployable package.
 */
public interface IModule
    extends IAbstractPackage<IModule> {

    /**
     * @return the parent namespace that contains this module.
     */
    default INamespace getContainingNamespace() {
        return this.getModuleContainmentRelationship().getContainingNamespace();
    }

    /**
     * @return the relationship to the parent namespace that contains this namespace.
     */
    IModuleContainment getModuleContainmentRelationship();


    /**
     * @return the relationships to the modules that are dependencies of this module.
     */
    Set<? extends IModuleDependency> getDependedModuleRelationships();

    /**
     * @return the modules that are dependencies of this module.
     */
    default Set<IModule> getDependedModules() {
        return this.getDependedModuleRelationships().stream().map( IModuleDependency::getDependedModule ).collect( Collectors.toSet() );
    }

    /**
     * @return the relationships to the modules that are dependents of this module.
     */
    Set<? extends IModuleDependency> getDependingModuleRelationships();

    /**
     * @return the modules that are dependents of this module.
     */
    default Set<IModule> getDependingModules() {
        return this.getDependingModuleRelationships().stream().map( IModuleDependency::getDependingModule ).collect( Collectors.toSet() );
    }

    /**
     * @return The version of this module.
     */
    String getVersion();

    /**
     * Changes the version of this module.
     *
     * @param version the new version.
     * @return this module.
     */
    IModule setVersion( String version );

}
