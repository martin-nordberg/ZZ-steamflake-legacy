package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IComponent;

import java.util.UUID;

/**
 * Base class for implementations of IComponent.
 */
public abstract class AbstractComponent<ISelf, IParent extends INamedContainerElement>
    extends AbstractFunction<ISelf, IParent>
    implements IComponent<ISelf, IParent> {

    protected AbstractComponent( UUID id ) {
        super( id );
    }

    @Override
    public final IClass makeClass( UUID id, String name, String summary, boolean isExported ) {
        return new Class( id, this, name, summary, isExported );
    }

}
