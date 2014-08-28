package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodelimpl.structure.Namespace;

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
            this.database.update( "INSERT INTO MODEL_ELEMENT (ID, PARENT_CONTAINER_ID, SUMMARY, TYPE) VALUES (?, ?, ?, 'Namespace')",
                                  namespace.getId(), namespace.getId()/*TBD*/, namespace.getSummary() );
            this.database.update( "INSERT INTO CONTAINER_ELEMENT (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMED_ELEMENT (ID, NAME) VALUES (?, ?)", namespace.getId(), namespace.getName() );
            this.database.update( "INSERT INTO NAMED_CONTAINER_ELEMENT (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO ABSTRACT_NAMESPACE (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMESPACE (ID) VALUES (?)", namespace.getId() );
        } );
    }

    public void deleteNamespace( UUID namespaceId ) {
        this.database.update( "UPDATE MODEL_ELEMENT SET DESTROYED = TRUE WHERE ID = ?", namespaceId );
    }

    public INamespace findNamespaceByUuid( UUID namespaceId ) {
        return this.database.findUniqueOrNull( Namespace.class, "SELECT TO_CHAR(ID), TO_CHAR(PARENT_CONTAINER_ID), NAME, SUMMARY FROM V_NAMESPACE WHERE ID = ?", namespaceId );
    }

    public List<? extends INamespace> findNamespacesAll() {
        return this.database.findAll( Namespace.class, "SELECT TO_CHAR(ID), TO_CHAR(PARENT_CONTAINER_ID), NAME, SUMMARY FROM V_NAMESPACE" );
    }

    private final Database database;

}
