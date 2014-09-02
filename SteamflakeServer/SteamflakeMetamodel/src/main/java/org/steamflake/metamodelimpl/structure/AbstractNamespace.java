package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodelimpl.elements.AbstractNamedElement;

import java.util.UUID;

/**
 * Abstract base class for concrete namespaces.
 */
public abstract class AbstractNamespace<ISelf>
    extends AbstractNamedElement<ISelf, IAbstractNamespace>
    implements IAbstractNamespace<ISelf> {

    protected AbstractNamespace( UUID id ) {
        super( id );
    }

    @Override
    public final INamespace makeNamespace( UUID id, String name, String summary ) {
        return new Namespace( id, this, name, summary );
    }

}
