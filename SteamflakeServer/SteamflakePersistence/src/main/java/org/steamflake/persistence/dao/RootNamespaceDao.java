package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.metamodelimpl.structure.RootNamespace;

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
     * @return the root namespace.
     */
    public IRootNamespace findRootNamespace() {

        List<RootNamespace> result = this.database.findAll( RootNamespace.class, "SELECT TO_CHAR(ID), SUMMARY FROM V_ROOT_NAMESPACE" );
        return result.get( 0 );

    }

    private final Database database;

}
