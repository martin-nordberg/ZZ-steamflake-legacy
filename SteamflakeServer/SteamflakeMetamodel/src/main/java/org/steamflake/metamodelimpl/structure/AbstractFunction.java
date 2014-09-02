package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.structure.IFunction;

import java.util.UUID;

/**
 * Base class for implementations of IFunction.
 */
public abstract class AbstractFunction<ISelf, IParent extends INamedContainerElement>
    extends AbstractFunctionSignature<ISelf, IParent>
    implements IFunction<ISelf, IParent> {

    protected AbstractFunction( UUID id ) {
        super( id );
    }

}
