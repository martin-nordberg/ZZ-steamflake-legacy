package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractPackage;
import org.steamflake.metamodel.structure.IPackage;

/**
 * Implementation of IPackage.
 */
public final class Package
    extends AbstractPackage<IPackage, IAbstractPackage>
    implements IPackage {

    /**
     * Constructs a new package with given attributes.
     *
     * @param self       the registered shared reference to the object.
     * @param parent     the parent package of the new package.
     * @param name       the name of the package.
     * @param summary    a summary of the package.
     * @param isExported whether the new package is visible outside this one.
     */
    public Package( Ref<IPackage> self, Ref<? extends IAbstractPackage> parent, String name, String summary, boolean isExported ) {
        super( self, parent, name, summary, isExported );
    }

    @Override
    public IAbstractPackage getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( IAbstractPackage.class, registry );
    }
}
