package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

import java.util.UUID;

/**
 * A function signature represents the name and parameters of a function.
 */
public interface IFunctionSignature<ISelf, IParent extends INamedContainerElement>
    extends INamedContainerElement<ISelf, IParent> {

    /**
     * Whether this function signature is accessible outside its parent container.
     *
     * @return true if this function can be called from other container contexts.
     */
    boolean isExported();

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

    /**
     * Changes whether this function signature is exported outside its container.
     *
     * @param isExported the new value.
     * @return the modified function signature.
     */
    ISelf setExported( boolean isExported );

}
