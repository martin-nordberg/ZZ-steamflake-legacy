package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IClass;

/**
 * Implementation of IClass.
 */
public final class Class
    extends AbstractComponent<IClass>
    implements IClass {

    /**
     * Constructs a new class with given attributes.
     *
     * @param self    the registered shared reference to the object.
     * @param name    the name of the class.
     * @param summary a summary of the class.
     */
    public Class( Ref<IClass> self, String name, String summary ) {
        super( IClass.class, self, name, summary );
    }

}
