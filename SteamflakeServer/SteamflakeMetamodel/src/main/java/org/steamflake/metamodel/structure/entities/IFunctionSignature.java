package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.elements.INamedEntity;

import java.util.UUID;

/**
 * A function signature represents the name and parameters of a function.
 */
public interface IFunctionSignature<ISelf extends IFunctionSignature>
    extends INamedEntity<ISelf> {

    /**
     * Adds a new parameter to this function.
     *
     * @param id       the unique ID of the parameter.
     * @param name     the name of the parameter.
     * @param summary  a short summary of the parameter.
     * @param sequence the position of the parameter in the function's list of parameters.
     * @return the newly created parameter.
     */
    IParameter makeParameter( UUID id, String name, String summary, int sequence );

}
