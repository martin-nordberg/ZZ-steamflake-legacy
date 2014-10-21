package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IClass;
import org.steamflake.metamodel.api.structure.entities.IComponent;

import java.util.UUID;

/**
 * Base class for implementations of IComponent.
 */
public abstract class AbstractComponent<ISelf extends IComponent>
    extends AbstractFunction<ISelf>
    implements IComponent<ISelf> {

    protected AbstractComponent( java.lang.Class<ISelf> selfType, Ref<ISelf> self, String name, String summary ) {
        super( selfType, self, summary, name );
    }

    @Override
    public final IClass makeClass( UUID id, String name, String summary ) {
        return new Class( this.getSelf().makeRefById( id ), name, summary );
    }

}
