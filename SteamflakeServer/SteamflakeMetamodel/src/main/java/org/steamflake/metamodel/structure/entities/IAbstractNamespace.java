package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.elements.INamedEntity;
import org.steamflake.metamodel.structure.relationships.INamespaceContainment;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * An abstract namespace is a naming structure distinguishing modules.
 */
public interface IAbstractNamespace<ISelf extends IAbstractNamespace>
    extends INamedEntity<ISelf> {

    /**
     * @return the set of relationships to the namespaces that are children of this namespace.
     */
    Set<? extends INamespaceContainment> getNamespaceContainmentRelationships();

    /**
     * @return the namespaces that are children of this namespace.
     */
    default Set<INamespace> getContainedNamespaces() {
        return this.getNamespaceContainmentRelationships()
            .stream()
            .map( INamespaceContainment::getContainedNamespace )
            .collect( Collectors.toSet() );
    }

    /**
     * Creates a new namespace that is a child of this one.
     *
     * @param id      the unique ID for the new namespace.
     * @param name    the name of the new namespace.
     * @param summary the short summary of the new namespace.
     * @return the namespace created.
     */
    INamespace makeNamespace( UUID id, String name, String summary );

}
