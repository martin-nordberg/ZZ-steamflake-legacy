package org.steamflake.metamodel.actions.elements;

import org.steamflake.metamodel.api.elements.IAction;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.impl.elements.AbstractElement;

import java.util.UUID;

/**
 * Abstract base class for actions.
 */
public abstract class AbstractAction<ISelf extends IAction>
    extends AbstractElement<ISelf>
    implements IAction<ISelf> {

    /**
     * Constructs a new abstract action.
     *
     * @param self the registered reference to the new action.
     */
    protected AbstractAction( Class<ISelf> selfType, Ref<ISelf> self ) {
        super( selfType, self );
    }

    @Override
    public final boolean isDestroyed() {
        return false;
    }

    @Override
    public final IAction makeReversingAction( UUID id ) {
        if ( !this.canReverse() ) {
            throw new IllegalStateException( "Action cannot be reversed." );
        }
        return this.doMakeReversingAction( id );
    }

    @Override
    public final ISelf setDestroyed( boolean destroyed ) {
        throw new UnsupportedOperationException( "Actions can be reversed but not destroyed." );
    }

    /**
     * Performs the work of creating a reversing action.
     *
     * @param id the unique ID of the new action.
     * @return the newly created action
     */
    protected abstract IAction doMakeReversingAction( UUID id );

}
