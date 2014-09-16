package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.elements.INamedElement;

/**
 * A parameter represents one potential argument to a function.
 */
public interface IParameter
    extends INamedElement<IParameter> {

    // TBD: parent is function signature

    int getSequence();

    IParameter setSequence( int sequence );

    // TBD: defaultValue
    // TBD: isVariadic
    // TBD: type

}
