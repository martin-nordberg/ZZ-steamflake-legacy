package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.structure.IAbstractPackage;
import org.steamflake.metamodel.structure.IPackage;

import java.util.UUID;

/**
 * Base class for implementations of IAbstractPackage.
 */
public abstract class AbstractPackage<ISelf, IParent extends INamedContainerElement>
    extends AbstractComponent<ISelf, IParent>
    implements IAbstractPackage<ISelf, IParent> {


    protected AbstractPackage( UUID id ) {
        super( id );
    }

    @Override
    public final IPackage makePackage( UUID id, String name, String summary, boolean isExported ) {
        return new Package( id, this, name, summary, isExported );
    }

}
