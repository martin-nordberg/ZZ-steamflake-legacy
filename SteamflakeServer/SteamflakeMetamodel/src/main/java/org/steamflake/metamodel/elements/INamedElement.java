package org.steamflake.metamodel.elements;

/**
 * Interface to an abstract named model element.
 */
public interface INamedElement<ISelf extends INamedElement, IParent extends INamedContainerElement>
    extends IModelElement<ISelf, IParent> {

    /**
     * @return the name of this model element.
     */
    String getName();

    /**
     * Changes the name of this model element.
     *
     * @param name the new name.
     * @return this model element.
     */
    ISelf setName( String name );

}
