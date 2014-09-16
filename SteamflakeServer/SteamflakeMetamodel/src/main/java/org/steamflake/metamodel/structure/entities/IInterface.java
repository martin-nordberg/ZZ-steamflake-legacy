package org.steamflake.metamodel.structure.entities;

import org.steamflake.metamodel.elements.INamedElement;

/**
 * An interface represents the behavior of a component.
 */
public interface IInterface
    extends INamedElement<IInterface> {

    // TBD: parent is component

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
