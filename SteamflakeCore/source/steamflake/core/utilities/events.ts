
/**
 * Module: steamflake/core/utilities/events
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a general event with one data parameter.
 */
export interface IEvent {

    /**
     * Whether this event will propagate to its listeners. Note: read only.
     */
    enabled : boolean;

    /**
     * Performs a task with the triggering of this event turned off.
     * @param nonTriggeringTask
     */
    whileDisabledDo( nonTriggeringTask: () => void ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a general event with one data parameter.
 */
export interface IStatelessEvent<EventSource>
    extends IEvent {

    /**
     * Registers a listener for this event.
     * @param listener A listener to begin receiving this event.
     */
    registerListener( listener: (EventSource) => void ) : void;

    /**
     * Triggers this event
     */
    trigger() : void;

    /**
     * Unregisters a listener from this event.
     * @param listener A previously registered listener to be removed.
     */
    unregisterListener( listener: (EventSource) => void ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a general event with one data parameter.
 */
export interface IStatefulEvent<EventSource,EventParam>
    extends IEvent {

    /**
     * Registers a listener for this event.
     * @param listener A listener to begin receiving this event.
     */
    registerListener( listener: (EventSource, EventParam) => void ) : void;

    /**
     * Triggers this event with given parameter.
     * @param param The data to pass with the event.
     */
    trigger( param : EventParam ) : void;

    /**
     * Unregisters a listener from this event.
     * @param listener A previously registered listener to be removed.
     */
    unregisterListener( listener: (EventSource, EventParam) => void ) : void;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class BaseEvent<EventSource,ListenerFn> {

    /**
     * Constructs a new event.
     * @param eventSource The event's source.
     */
    constructor(
        eventSource : EventSource
    ) {
        this._enabled = true;
        this._eventSource = eventSource;
        this._listeners = [];
    }

    /** Whether this event will propagate to its listeners. */
    public get enabled() {
        return this._enabled;
    }
    public set enabled( value: boolean ) {
        throw new Error( "Attempted to change read only attribute - enabled." );
    }

    /**
     * Repeats a task with each listener.
     * @param task The task to complete.
     */
    public forEachListener( task : (EventSource,ListenerFn)=>void ) {
        if ( this._enabled ) {
            this._listeners.forEach( listener => task( this._eventSource, listener ) );
        }
    }

    /**
     * Registers a listener for this event.
     * @param listener A listener to begin receiving this event.
     */
    public registerListener( listener: ListenerFn ) {
        this._listeners.push( listener );
    }

    /**
     * Unregisters a listener from this event.
     * @param listenerToRemove A previously registered listener to be removed.
     */
    public unregisterListener( listenerToRemove: ListenerFn ) {
        this._listeners = this._listeners.filter( listener => listener !== listenerToRemove )
    }

    /**
     * Performs a task with the triggering of this event turned off.
     * @param nonTriggeringTask
     */
    public whileDisabledDo( nonTriggeringTask: () => void ) {
        var origEnabled = this._enabled;

        this._enabled = false;
        try {
            nonTriggeringTask();
        }
        finally {
            this._enabled = origEnabled;
        }
    }

    /** Whether this event will propgate to its listeners. */
    private _enabled : boolean;

    /** The event's source. */
    private _eventSource : EventSource;

    /** The currently registered listeners. */
    private _listeners : ListenerFn[];

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a general event with no data parameters.
 */
class StatelessEvent<EventSource>
    extends BaseEvent<EventSource,(EventSource) => void>
    implements IStatelessEvent<EventSource>
{

    /**
     * Constructs a new event.
     * @param eventSource The event's source.
     */
    constructor(
        eventSource : EventSource
    ) {
        super( eventSource );
    }

    /**
     * Triggers this event to all registered listeners.
     */
    public trigger() {
        this.forEachListener( function( eventSource: EventSource, listener: (EventSource) => void ) {
            listener( eventSource );
        } );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Implementation of a general event with one data parameter.
 */
class StatefulEvent<EventSource,EventParam>
    extends BaseEvent<EventSource,(EventSource, EventParam) => void>
    implements IStatefulEvent<EventSource,EventParam>
{

    /**
     * Constructs a new event.
     * @param eventSource The event's source.
     */
    constructor(
        eventSource : EventSource
    ) {
        super( eventSource );
    }

    /**
     * Triggers this event to all registered listeners.
     * @param param The parameter value to send with the event.
     */
    public trigger( param: EventParam ) {
        this.forEachListener( function( eventSource: EventSource, listener: (EventSource, EventParam) => void ) {
            listener( eventSource, param );
        } );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeStatelessEvent<EventSource>( eventSource : EventSource ) : IStatelessEvent<EventSource> {
    return new StatelessEvent( eventSource );
}

export function makeStatefulEvent<EventSource,EventParam>( eventSource : EventSource ) : IStatefulEvent<EventSource,EventParam> {
    return new StatefulEvent<EventSource,EventParam>( eventSource );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
