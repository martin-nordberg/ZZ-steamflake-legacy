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
            this.database.update( "INSERT INTO MODEL_ELEMENT (UUID) VALUES (?)", namespace.getUuid() );
            this.database.update( "INSERT INTO NAMESPACE (UUID, NAME, SUMMARY) VALUES (?, ?, ?)", namespace.getUuid(), namespace.getName(), namespace.getSummary() );
        } );
    }

    public void deleteNamespace( String namespaceUuid) {
        this.database.update( "DELETE FROM MODEL_ELEMENT WHERE UUID = ?", namespaceUuid );
    }

    public INamespace findNamespaceByUuid( String uuid ) {
        return this.database.findUnique( Namespace.class, "SELECT UUID, NAME, SUMMARY FROM NAMESPACE WHERE UUID = ?", uuid );
    }

    private final Database database;
}
