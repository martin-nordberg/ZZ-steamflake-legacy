package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.api.structure.entities.IPackage;
import org.steamflake.metamodel.api.structure.relationships.IPackageContainment;

/**
 * Implementation of IPackage.
 */
public final class Package
    extends AbstractPackage<IPackage>
    implements IPackage {

    /**
     * Constructs a new package with given attributes.
     *
     * @param self    the registered shared reference to the object.
     * @param name    the name of the package.
     * @param summary a summary of the package.
     */
    public Package( Ref<IPackage> self, String name, String summary ) {
        super( self, name, summary );
    }

    @Override
    public IPackageContainment getPackageContainmentRelationship() {
        return null;  // TODO
    }

    @Override
    public IPackage moveToNewContainingPackage( IAbstractPackage containingPackage, boolean isExported ) {
        // TODO
        return this;
    }

}
