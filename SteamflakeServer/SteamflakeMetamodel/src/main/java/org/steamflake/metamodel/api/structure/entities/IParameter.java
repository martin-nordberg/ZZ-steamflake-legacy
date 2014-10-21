package org.steamflake.metamodel.api.structure.entities;

import org.steamflake.metamodel.api.elements.INamedEntity;

/**
 * A parameter represents one potential argument to a function.
 */
public interface IParameter
    extends INamedEntity<IParameter> {

    // TBD: parent is function signature

    int getSequence();

    IParameter setSequence( int sequence );

    // TBD: defaultValue
    // TBD: isVariadic
    // TBD: type

}
