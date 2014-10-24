package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IAbstractPackage;
import org.steamflake.metamodel.api.structure.entities.IPackage;
import org.steamflake.metamodel.api.structure.relationships.IPackageContainment;

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
        return new Package( this.getSelf().makeRefById( id, IPackage.class ), name, summary );
    }


}
