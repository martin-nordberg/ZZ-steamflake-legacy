package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

/**
 * A component represents a reusable element of behavior.
 */
public interface IComponent<ISelf, IParent extends INamedContainerElement>
    extends IFunction<ISelf, IParent> {

}
