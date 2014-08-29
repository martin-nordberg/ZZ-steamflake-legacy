package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

import java.util.UUID;

/**
 * An abstract package collects related components.
 */
public interface IAbstractPackage<ISelf, IParent extends INamedContainerElement>
    extends IComponent<ISelf, IParent> {

    /**
     * Creates a new package as a child of this one.
     *
     * @param id         the unique ID for the new package.
     * @param name       the name of the new package.
     * @param summary    a short summary of the new package.
     * @param isExported whether the package is exported outside its parent package.
     * @return the newly created package.
     */
    IPackage makePackage( UUID id, String name, String summary, boolean isExported );

}
