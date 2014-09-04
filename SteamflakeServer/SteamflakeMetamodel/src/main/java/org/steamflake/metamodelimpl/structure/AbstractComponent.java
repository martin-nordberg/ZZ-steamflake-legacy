package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IComponent;

import java.util.UUID;

/**
 * Base class for implementations of IComponent.
 */
public abstract class AbstractComponent<ISelf extends IComponent, IParent extends INamedContainerElement>
    extends AbstractFunction<ISelf, IParent>
    implements IComponent<ISelf, IParent> {

    protected AbstractComponent( UUID id, Ref<IParent> parentContainer, String name, String summary, boolean isExported ) {
        super( id, parentContainer, summary, name, isExported );
    }

    @Override
    public final IClass makeClass( UUID id, String name, String summary, boolean isExported ) {
        return new Class( id, this, name, summary, isExported );
    }

}
