package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractPackage;
import org.steamflake.metamodel.structure.IPackage;

import java.util.UUID;

/**
 * Implementation of IPackage.
 */
public final class Package
    extends AbstractPackage<IPackage, IAbstractPackage>
    implements IPackage {

    /**
     * Constructs a new package with given attributes.
     *
     * @param id         the unique ID of the package.
     * @param parentId   the unique ID of the parent package of the new package.
     * @param name       the name of the package.
     * @param summary    a summary of the package.
     * @param isExported whether the new package is visible outside this one.
     */
    public Package( String id, String parentId, String name, String summary, boolean isExported ) {
        super( UUID.fromString( id ), Ref.byId( UUID.fromString( parentId ) ), name, summary, isExported );
    }

    public Package( UUID id, Ref<? extends IAbstractPackage> parent, String name, String summary, boolean isExported ) {
        super( id, parent, name, summary, isExported );
    }

    @Override
    public IAbstractPackage getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( IAbstractPackage.class, registry );
    }
}
