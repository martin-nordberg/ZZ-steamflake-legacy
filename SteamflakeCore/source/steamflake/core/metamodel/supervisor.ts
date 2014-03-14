
/**
 * Module: steamflake/core/metamodel/supervisor
 */

import commands = require( '../concurrency/commands' );
import elements = require( './elements' );
import listeners = require( './listeners' );
import persistence = require( './persistence' );
import registry = require( './registry' );
import services = require( './services' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to entry point facade over L-Zero Metamodel services.
 */
export interface IMetamodelSupervisor<RootElement extends elements.IRootContainerElement> {

    /**
     * The history of commands executed upon the metamodel managed by this supervisor.
     */
    commandHistory : commands.ICommandHistory;

    /**
     * Provides services for loading the metamodel into memory.
     */
    queryService : services.IQueryService<RootElement>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to entry point facade over L-Zero Metamodel services.
 */
class MetamodelSupervisor<RootElement extends elements.IRootContainerElement>
    implements IMetamodelSupervisor<RootElement> {

    constructor(
        persistentStore : persistence.IPersistentStore<RootElement>,
        commandHistory : commands.ICommandHistory
    ) {
        var codeElementRegistry = registry.makeInMemoryModelElementRegistry();
        codeElementRegistry = listeners.makeUpdateListeningCodeElementRegistry( codeElementRegistry, persistentStore.creator, persistentStore.updater, persistentStore.deleter, commandHistory );
        codeElementRegistry = registry.makeChildRegisteringModelElementRegistry( codeElementRegistry );

        this._commandHistory = commandHistory;
        this._queryService = services.makeQueryService( persistentStore, codeElementRegistry );
    }

    /**
     * The history of commands executed upon the metamodel managed by this supervisor.
     */
    public get commandHistory() : commands.ICommandHistory {
        return this._commandHistory;
    }

    /**
     * Provides services for loading the metamodel into memory.
     */
    public get queryService() : services.IQueryService<RootElement> {
        return this._queryService;
    }

    private _commandHistory : commands.ICommandHistory;

    private _queryService : services.IQueryService<RootElement>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Makes a new metamodel supervisor from given command history and persistent store.
 * @param persistentStore The persistent store for model elements.
 * @param commandHistory The command history for tracking element changes.
 */
export function makeMetamodelSupervisor<RootElement extends elements.IRootContainerElement>(
    persistentStore : persistence.IPersistentStore<RootElement>,
    commandHistory : commands.ICommandHistory = commands.makeNullCommandHistory()
) : IMetamodelSupervisor<RootElement> {
    return new MetamodelSupervisor<RootElement>( persistentStore, commandHistory );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

