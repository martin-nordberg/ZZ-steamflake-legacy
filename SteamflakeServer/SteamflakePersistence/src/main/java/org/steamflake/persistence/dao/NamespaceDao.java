package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.INamespace;
import org.steamflake.metamodel.impl.Namespace;

/**
 * Data access object for namespaces.
 */
public class NamespaceDao {

    public NamespaceDao( Database database ) {
        this.database = database;
    }

    public void createNamespace( INamespace namespace ) {
        this.database.withVoidTransaction( tx -> {
            this.database.update( "INSERT INTO MODEL_ELEMENT (UUID, SUMMARY) VALUES (?, ?)", namespace.getUuid(), namespace.getSummary() );
            this.database.update( "INSERT INTO CONTAINER_ELEMENT (UUID) VALUES (?)", namespace.getUuid() );
            this.database.update( "INSERT INTO NAMED_ELEMENT (UUID, NAME) VALUES (?, ?)", namespace.getUuid(), namespace.getName() );
            this.database.update( "INSERT INTO NAMED_CONTAINER_ELEMENT (UUID) VALUES (?)", namespace.getUuid() );
            this.database.update( "INSERT INTO NAMESPACE (UUID) VALUES (?)", namespace.getUuid() );
        } );
    }

    public void deleteNamespace( String namespaceUuid) {
        this.database.update( "DELETE FROM MODEL_ELEMENT WHERE UUID = ?", namespaceUuid );
    }

    public INamespace findNamespaceByUuid( String uuid ) {
        return this.database.findUnique( Namespace.class, "SELECT UUID, NAME, SUMMARY FROM V_NAMESPACE WHERE UUID = ?", uuid );
    }

    private final Database database;
}
