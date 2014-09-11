package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractPackage;
import org.steamflake.metamodel.structure.IPackage;

import java.util.UUID;

/**
 * Base class for implementations of IAbstractPackage.
 */
public abstract class AbstractPackage<ISelf extends IAbstractPackage, IParent extends INamedContainerElement>
    extends AbstractComponent<ISelf, IParent>
    implements IAbstractPackage<ISelf, IParent> {


    protected AbstractPackage( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String name, String summary, boolean isExported ) {
        super( self, parentContainer, name, summary, isExported );
    }

    @Override
    public final IPackage makePackage( UUID id, String name, String summary, boolean isExported ) {
        return new Package( Ref.byId( id ), this.getSelf(), name, summary, isExported );
    }

}
