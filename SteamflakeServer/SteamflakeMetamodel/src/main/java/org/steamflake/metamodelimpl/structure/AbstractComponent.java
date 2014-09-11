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

    protected AbstractComponent( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String name, String summary, boolean isExported ) {
        super( self, parentContainer, summary, name, isExported );
    }

    @Override
    public final IClass makeClass( UUID id, String name, String summary, boolean isExported ) {
        return new Class( Ref.byId( id ), this.getSelf(), name, summary, isExported );
    }

}
