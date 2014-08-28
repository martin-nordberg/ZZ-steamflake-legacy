package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

/**
 * An abstract package collects related components.
 */
public interface IAbstractPackage<ISelf, IParent extends INamedContainerElement>
    extends IComponent<ISelf, IParent> {

}
