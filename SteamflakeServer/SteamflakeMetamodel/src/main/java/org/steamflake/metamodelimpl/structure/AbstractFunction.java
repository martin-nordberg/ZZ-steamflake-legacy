package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IFunction;

import java.util.UUID;

/**
 * Base class for implementations of IFunction.
 */
public abstract class AbstractFunction<ISelf extends IFunction, IParent extends INamedContainerElement>
    extends AbstractFunctionSignature<ISelf, IParent>
    implements IFunction<ISelf, IParent> {

    protected AbstractFunction( UUID id, Ref<IParent> parentContainer, String name, String summary, boolean isExported ) {
        super( id, parentContainer, name, summary, isExported );
    }

}
