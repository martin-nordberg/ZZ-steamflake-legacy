package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

/**
 * An interface represents the behavior of a component.
 */
public interface IInterface
    extends INamedContainerElement<IInterface, IComponent> {

    /**
     * Whether this interface is accessible outside its parent component.
     *
     * @return true if this function can be called from other component contexts.
     */
    boolean isExported();

    /**
     * Changes whether this interface is exported outside its parent component.
     *
     * @param isExported the new value.
     * @return the modified interface.
     */
    IInterface setExported( boolean isExported );


}
