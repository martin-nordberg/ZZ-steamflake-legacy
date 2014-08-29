package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedElement;

/**
 * A parameter represents one potential argument to a function.
 */
public interface IParameter
    extends INamedElement<IParameter, IFunctionSignature> {

    int getSequence();

    IParameter setSequence( int sequence );

    // TBD: defaultValue
    // TBD: isVariadic
    // TBD: type

}
