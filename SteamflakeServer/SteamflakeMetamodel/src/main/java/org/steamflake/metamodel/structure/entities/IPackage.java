package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.structure.relationships.IPackageContainment;

/**
 * A package collects related components.
 */
public interface IPackage
    extends IAbstractPackage<IPackage> {

    /**
     * @return the parent package that contains this package.
     */
    default IAbstractPackage getContainingPackage() {
        return this.getPackageContainmentRelationship().getContainingPackage();
    }

    /**
     * @return the relationship to the parent package that contains this package.
     */
    IPackageContainment getPackageContainmentRelationship();

    /**
     * Moves this package to a new parent package.
     * @param containingPackage the new package to contain this one.
     * @param isExported whether this package will be exported from its new parent.
     * @return this package for chained calls.
     */
    IPackage moveToNewContainingPackage( IAbstractPackage containingPackage, boolean isExported );

}