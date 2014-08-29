package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

import java.util.UUID;

/**
 * A component represents a reusable element of behavior.
 */
public interface IComponent<ISelf, IParent extends INamedContainerElement>
    extends IFunction<ISelf, IParent> {

    /**
     * Creates a new class as a child of this component.
     *
     * @param id         the unique ID for the new class.
     * @param name       the name of the new class.
     * @param summary    a short summary of the new class.
     * @param isExported whether the class is exported outside its parent container.
     * @return the newly created class.
     */
    IClass makeClass( UUID id, String name, String summary, boolean isExported );

}
