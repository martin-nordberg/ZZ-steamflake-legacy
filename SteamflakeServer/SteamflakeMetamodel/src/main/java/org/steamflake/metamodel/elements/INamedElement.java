package org.steamflake.metamodel.elements;

/**
 * Interface to an abstract named model element.
 */
public interface INamedElement<ISelf, IParent extends INamedContainerElement>
    extends IModelElement<ISelf, IParent> {

    /**
     * @return the name of this model element.
     */
    String getName();

    /**
     * Chanegs the name of this model element.
     *
     * @param name the new name.
     * @return this model element.
     */
    ISelf setName( String name );

}
