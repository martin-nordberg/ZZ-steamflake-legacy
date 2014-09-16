package org.steamflake.metamodelimpl.structure.entities;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.entities.IFunction;

/**
 * Base class for implementations of IFunction.
 */
public abstract class AbstractFunction<ISelf extends IFunction>
    extends AbstractFunctionSignature<ISelf>
    implements IFunction<ISelf> {

    protected AbstractFunction( Ref<ISelf> self, String name, String summary ) {
        super( self, name, summary );
    }

}
