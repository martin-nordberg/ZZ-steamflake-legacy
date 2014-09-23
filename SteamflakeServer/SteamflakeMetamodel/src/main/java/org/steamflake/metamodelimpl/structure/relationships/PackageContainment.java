package org.steamflake.metamodelimpl.structure.relationships;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.structure.entities.IPackage;
import org.steamflake.metamodel.structure.relationships.IPackageContainment;
import org.steamflake.metamodelimpl.elements.AbstractRelationship;
import org.steamflake.utilities.revisions.V;

/**
 * Concrete implementation of package containment relationship.
 */
public class PackageContainment
    extends AbstractRelationship<IPackageContainment,IAbstractPackage,IPackage>
    implements IPackageContainment {

    protected PackageContainment( Ref<IPackageContainment> self, IAbstractPackage containingPackage, IPackage containedPackage, boolean isExported ) {
        super( self, containingPackage, containedPackage );
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
