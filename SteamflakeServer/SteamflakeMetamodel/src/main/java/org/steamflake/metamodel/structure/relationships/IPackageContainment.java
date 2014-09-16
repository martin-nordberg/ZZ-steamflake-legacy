package org.steamflake.metamodel.structure.relationships;

import org.steamflake.metamodel.elements.IModelRelationship;
import org.steamflake.metamodel.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.structure.entities.IPackage;

/**
 * Parent/child relationship from abstract packages to packages.
 */
public interface IPackageContainment
    extends IModelRelationship<IAbstractPackage,IPackage> {

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
