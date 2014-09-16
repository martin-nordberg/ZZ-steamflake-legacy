package org.steamflake.metamodelimpl.structure.relationships;

import org.steamflake.metamodel.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.structure.entities.IPackage;
import org.steamflake.metamodel.structure.relationships.IPackageContainment;
import org.steamflake.metamodelimpl.elements.AbstractModelRelationship;
import org.steamflake.utilities.revisions.V;

/**
 * Concrete implementation of package containment relationship.
 */
public class PackageContainment
    extends AbstractModelRelationship<IAbstractPackage,IPackage>
    implements IPackageContainment {

    protected PackageContainment( IAbstractPackage containingPackage, IPackage containedPackage, boolean isExported ) {
        super( containingPackage, containedPackage );
        this.isExported = new V<>( isExported );
    }

    @Override
    public boolean isExported() {
        return this.isExported.get();
    }

    @Override
    public IPackageContainment setExported( boolean isExported ) {
        this.isExported.set( isExported );
        return this;
    }

    private final V<Boolean> isExported;

}
