package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.metamodelimpl.structure.RootNamespace;
import org.steamflake.utilities.uuids.Uuids;

import java.util.List;

/**
 * Data access for the root namespace.
 */
public class RootNamespaceDao {

    public RootNamespaceDao( Database database ) {
        this.database = database;
    }

    /**
     * Finds the one and only root namespace. (Creates it for the first time if not found.)
     * @return the root namespace
     */
    public IRootNamespace findRootNamespace() {
        List<RootNamespace> result = this.database.findAll( RootNamespace.class, "SELECT TO_CHAR(ID), SUMMARY FROM V_ROOT_NAMESPACE" );

        if ( result.isEmpty() ) {
            result.add( new RootNamespace( Uuids.makeUuid().toString(), "(Top level namespace)" ) );
            this.createRootNamespace( result.get( 0 ) );
        }

        return result.get( 0 );
    }

    private void createRootNamespace( IRootNamespace rootNamespace ) {
        this.database.withVoidTransaction( tx -> {
            this.database.update( "INSERT INTO MODEL_ELEMENT (ID, PARENT_CONTAINER_ID, SUMMARY, TYPE) VALUES (?, ?, ?, 'RootNamespace')",
                                  rootNamespace.getId(), rootNamespace.getId(), rootNamespace.getSummary() );
            this.database.update( "INSERT INTO CONTAINER_ELEMENT (ID) VALUES (?)", rootNamespace.getId() );
            this.database.update( "INSERT INTO ROOT_CONTAINER_ELEMENT (ID) VALUES (?)", rootNamespace.getId() );
            this.database.update( "INSERT INTO NAMED_ELEMENT (ID, NAME) VALUES (?, ?)", rootNamespace.getId(), rootNamespace.getName() );
            this.database.update( "INSERT INTO NAMED_CONTAINER_ELEMENT (ID) VALUES (?)", rootNamespace.getId() );
            this.database.update( "INSERT INTO ABSTRACT_NAMESPACE (ID) VALUES (?)", rootNamespace.getId() );
            this.database.update( "INSERT INTO ROOT_NAMESPACE (ID) VALUES (?)", rootNamespace.getId() );
        } );
    }

    private final Database database;

}
