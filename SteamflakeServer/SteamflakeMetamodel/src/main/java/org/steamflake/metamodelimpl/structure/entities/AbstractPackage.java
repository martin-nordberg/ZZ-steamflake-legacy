package org.steamflake.metamodelimpl.structure.entities;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.structure.entities.IPackage;
import org.steamflake.metamodel.structure.relationships.IPackageContainment;

import java.util.Set;
import java.util.UUID;

/**
 * Base class for implementations of IAbstractPackage.
 */
public class AbstractPackage<ISelf extends IAbstractPackage>
    extends AbstractComponent<ISelf>
    implements IAbstractPackage<ISelf> {


    protected AbstractPackage( Ref<ISelf> self, String name, String summary ) {
        super( self, name, summary );
    }

    @Override
    public Set<? extends IPackageContainment> getPackageContainmentRelationships() {
        return null; // TODO
    }

    @Override
    public final IPackage makePackage( UUID id, String name, String summary ) {
        return new Package( Ref.byId( id ), name, summary );
    }


}
