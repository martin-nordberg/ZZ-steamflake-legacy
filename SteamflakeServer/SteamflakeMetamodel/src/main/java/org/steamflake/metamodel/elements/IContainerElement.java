package org.steamflake.metamodel.elements;

/**
 * Interface to an abstract container of other model elements.
 */
public interface IContainerElement<ISelf extends IContainerElement, IParent extends IContainerElement>
    extends IModelElement<ISelf, IParent> {

    // TBD: children

}
