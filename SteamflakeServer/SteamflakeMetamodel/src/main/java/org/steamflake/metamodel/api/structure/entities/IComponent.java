package org.steamflake.metamodel.api.structure.entities;

import java.util.UUID;

/**
 * A component represents a reusable element of behavior.
 */
public interface IComponent<ISelf extends IComponent>
    extends IFunction<ISelf> {

    /**
     * Creates a new class as a child of this component.
     *
     * @param id      the unique ID for the new class.
     * @param name    the name of the new class.
     * @param summary a short summary of the new class.
     * @return the newly created class.
     */
    IClass makeClass( UUID id, String name, String summary );

}
