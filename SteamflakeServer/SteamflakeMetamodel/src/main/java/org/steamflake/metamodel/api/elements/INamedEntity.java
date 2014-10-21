package org.steamflake.metamodel.api.elements;

/**
 * Interface to an abstract named entity.
 */
public interface INamedEntity<ISelf extends INamedEntity>
    extends IEntity<ISelf> {

    /**
     * @return the name of this named entity.
     */
    String getName();

    /**
     * Changes the name of this named entity.
     *
     * @param name the new name.
     * @return this named entity.
     */
    ISelf setName( String name );

}
