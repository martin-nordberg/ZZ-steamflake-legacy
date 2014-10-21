package org.steamflake.metamodel.api.elements;

import java.util.UUID;

/**
 * Interface to a metamodel action.
 */
public interface IAction<ISelf extends IAction>
    extends IElement<ISelf> {

    /**
     * @return whether this action can be undone (reversed).
     */
    boolean canReverse();

    /**
     * @return a detailed description of this action.
     */
    String getDescription();

    /**
     * Creates a new action that reverses (compensates) this action.
     * Precondition: this.canReverse()
     */
    IAction makeReversingAction( UUID id );

}
