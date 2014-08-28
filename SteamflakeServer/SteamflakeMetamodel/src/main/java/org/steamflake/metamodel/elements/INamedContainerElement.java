package org.steamflake.metamodel.elements;

/**
 * Interface to an abstract model element that is both a container and named.
 */
public interface INamedContainerElement<ISelf, IParent extends INamedContainerElement>
    extends IContainerElement<ISelf, IParent>, INamedElement<ISelf, IParent> {

}
