package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.INamespace;
import org.steamflake.metamodel.impl.Namespace;

import java.util.List;
import java.util.UUID;

/**
 * Data access object for namespaces.
 */
public class NamespaceDao {

    public NamespaceDao( Database database ) {
        this.database = database;
    }

    public void createNamespace( INamespace namespace ) {
        this.database.withVoidTransaction( tx -> {
            this.database.update( "INSERT INTO MODEL_ELEMENT (ID, SUMMARY, TYPE) VALUES (?, ?, 'Namespace')", namespace.getId(), namespace.getSummary() );
            this.database.update( "INSERT INTO CONTAINER_ELEMENT (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMED_ELEMENT (ID, NAME) VALUES (?, ?)", namespace.getId(), namespace.getName() );
            this.database.update( "INSERT INTO NAMED_CONTAINER_ELEMENT (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO ABSTRACT_NAMESPACE (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMESPACE (ID) VALUES (?)", namespace.getId() );
        } );
    }

    public void deleteNamespace( UUID namespaceId) {
        this.database.update( "DELETE FROM MODEL_ELEMENT WHERE ID = ?", namespaceId );
    }

    public INamespace findNamespaceByUuid( UUID namespaceId ) {
        return this.database.findUnique( Namespace.class, "SELECT TO_CHAR(ID), NAME, SUMMARY FROM V_NAMESPACE WHERE ID = ?", namespaceId );
    }

    public List<? extends INamespace> findNamespacesAll() {
        return this.database.findAll( Namespace.class, "SELECT TO_CHAR(ID), NAME, SUMMARY FROM V_NAMESPACE" );
    }

    private final Database database;

}
