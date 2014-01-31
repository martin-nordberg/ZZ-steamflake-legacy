
/**
 * Module: lzero/utilities/events
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

/** Creates a new event instance with no parameters. */
export var makeStatelessEvent : <EventSource>( eventSource : EventSource ) => IStatelessEvent<EventSource>;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Creates a new event instance with parameters of given type. */
export var makeStatefulEvent : <EventSource,EventParam>( eventSource : EventSource ) => IStatefulEvent<EventSource,EventParam>;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

