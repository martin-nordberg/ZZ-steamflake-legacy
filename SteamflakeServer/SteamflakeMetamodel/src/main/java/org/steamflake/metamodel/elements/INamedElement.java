package org.steamflake.metamodel.elements;

import javax.annotation.Nonnull;

/**
 * Interface to an abstract named model element.
 */
public interface INamedElement
    extends IModelElement {

    /**
     * @return the name of this model element.
     */
    @Nonnull
    String getName();

}
