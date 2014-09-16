package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.structure.relationships.IModuleContainment;
import org.steamflake.metamodel.structure.relationships.INamespaceContainment;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * A namespace is a naming structure distinguishing modules. Namespaces are packages bigger than a module, smaller
 * than the root namespace.
 */
public interface INamespace
    extends IAbstractNamespace<INamespace> {

    /**
     * @return the set of relationships to the modules that are children of this namespace.
     */
    Set<? extends IModuleContainment> getModuleContainmentRelationships();

    /**
     * @return the modules that are children of this namespace.
     */
    default Set<IModule> getContainedModules() {
        return this.getModuleContainmentRelationships()
            .stream()
            .map( IModuleContainment::getContainedModule )
            .collect( Collectors.toSet() );
    }

    /**
     * @return the parent namespace that contains this namespace.
     */
    default IAbstractNamespace getContainingNamespace() {
        return this.getNamespaceContainmentRelationship().getContainingNamespace();
    }

    /**
     * @return the relationship to the parent namespace that contains this namespace.
     */
    INamespaceContainment getNamespaceContainmentRelationship();

    /**
     * Creates a new module.
     *
     * @param id      the unique ID for the new namespace.
     * @param name    the name of the new namespace.
     * @param summary the short summary of the new namespace.
     * @param version the version of the module.
     * @return the namespace created.
     */
    IModule makeModule( UUID id, String name, String summary, String version );

    /**
     * Moves this namespace to a new parent namespace.
     * @param containingNamespace the new parent.
     * @return this namespace for chaining purposes.
     */
    INamespace moveToNewContainingNamespace( IAbstractNamespace containingNamespace );

}
