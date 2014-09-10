package org.steamflake.metamodel.elements;

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
     * @param <IElement>       the type of element to find.
     * @return the model element found or Ref.missing() if not registered.
     */
    <IElement extends IModelElement> Ref<IElement> lookUpModelElementByUuid( Class<IElement> modelElementType, UUID id );

}
