package org.steamflake.metamodel.api.structure.relationships;

import org.steamflake.metamodel.api.elements.IRelationship;
import org.steamflake.metamodel.api.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.api.structure.entities.IPackage;

/**
 * Parent/child relationship from abstract packages to packages.
 */
public interface IPackageContainment
    extends IRelationship<IPackageContainment, IAbstractPackage, IPackage> {

    /**
     * @return the child packages of the relationship.
     */
    default IPackage getContainedPackage() {
        return this.getTo();
    }

    /**
     * @return the parent package of the relationship.
     */
    default IAbstractPackage getContainingPackage() {
        return this.getFrom();
    }

    /**
     * @return whether the child package is exported outside its parent package.
     */
    boolean isExported();

    /**
     * Changes whether the child package is exported outside its container.
     *
     * @param isExported the new value.
     * @return the modified function signature.
     */
    IPackageContainment setExported( boolean isExported );

}
