package org.steamflake.metamodel.elements;

import java.util.UUID;

/**
 * Top level base class for Steamflake model elements. Represents any model element with a summary and a unique ID.
 */
public interface IModelElement<ISelf extends IModelElement, IParent extends IContainerElement> {

    /**
     * @return the unique ID of this model element.
     */
    UUID getId();

    /**
     * @return the container of this model element.
     */
    IParent getParentContainer( IModelElementLookUp registry );

    /**
     * @return the unique ID of the container of this model element.
     */
    UUID getParentContainerId();

    /**
     * @return a shareable reference to this model element.
     */
    Ref<ISelf> getSelf();

    /**
     * @return a short summary of this model element.
     */
    String getSummary();

    /**
     * Changes the parent of this model element.
     *
     * @param parent the new parent.
     * @return this model element.
     */
    ISelf setParentContainer( IParent parent );

    /**
     * Changes the summary of this model element.
     *
     * @param summary the new summary.
     * @return this model element.
     */
    ISelf setSummary( String summary );

}
