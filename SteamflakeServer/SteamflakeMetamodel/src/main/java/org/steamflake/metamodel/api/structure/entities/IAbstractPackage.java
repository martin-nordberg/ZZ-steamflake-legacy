package org.steamflake.metamodel.api.structure.entities;

import org.steamflake.metamodel.api.structure.relationships.IPackageContainment;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * An abstract package collects related components.
 */
public interface IAbstractPackage<ISelf extends IAbstractPackage>
    extends IComponent<ISelf> {

    // TBD: parent of abstract package is named element (package or namespace)

    /**
     * @return the packages that are children of this package.
     */
    default Set<IPackage> getContainedPackages() {
        return this.getPackageContainmentRelationships().stream().map( IPackageContainment::getContainedPackage ).collect( Collectors.toSet() );
    }

    /**
     * @return the relationship to the packages that are children of this package.
     */
    Set<? extends IPackageContainment> getPackageContainmentRelationships();

    /**
     * Creates a new package as a child of this one.
     *
     * @param id      the unique ID for the new package.
     * @param name    the name of the new package.
     * @param summary a short summary of the new package.
     * @return the newly created package.
     */
    IPackage makePackage( UUID id, String name, String summary );

}
