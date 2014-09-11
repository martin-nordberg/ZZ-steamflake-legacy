package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodelimpl.elements.AbstractNamedElement;

import java.util.UUID;

/**
 * Abstract base class for concrete namespaces.
 */
public abstract class AbstractNamespace<ISelf extends IAbstractNamespace, IParent extends IAbstractNamespace>
    extends AbstractNamedElement<ISelf, IParent>
    implements IAbstractNamespace<ISelf, IParent> {

    protected AbstractNamespace( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String name, String summary ) {
        super( self, parentContainer, name, summary );
    }

    @Override
    public final INamespace makeNamespace( UUID id, String name, String summary ) {
        return new Namespace( Ref.byId( id ), this.getSelf(), name, summary );
    }

}
