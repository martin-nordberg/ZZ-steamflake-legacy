package org.steamflake.metamodel.elements;

import java.util.Optional;
import java.util.UUID;


/**
 * Interface to a facility for finding model elements by their UUID.
 */
public interface IModelElementLookUp {

    /**
     * Finds the model element with given UUID.
     *
     * @param modelElementType the type of element to find.
     * @param id               the unique ID of the model element to find.
     * @returns the model element found or Optional.empty() if not registered.
     */
    <T extends IModelElement> Optional<T> lookUpModelElementByUuid( Class<T> modelElementType, UUID id );

}
