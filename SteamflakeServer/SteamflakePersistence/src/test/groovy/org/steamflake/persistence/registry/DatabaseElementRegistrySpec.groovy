package org.steamflake.persistence.registry

import fi.evident.dalesbred.Database
import org.steamflake.metamodel.api.structure.entities.IRootNamespace
import org.steamflake.metamodel.impl.registry.InMemoryElementRegistry
import org.steamflake.persistence.h2database.H2DataSource
import org.steamflake.utilities.revisions.StmTransaction
import org.steamflake.utilities.revisions.StmTransactionContext
import spock.lang.Specification

/**
 * Tests for a database element registry.
 */
class DatabaseElementRegistrySpec extends Specification {

    static H2DataSource dataSource;
    Closeable connection;
    DatabaseElementRegistry registry;
    StmTransaction transaction;

    def setupSpec() {
        dataSource = new H2DataSource();
    }

    def setup() {
        registry = new DatabaseElementRegistry( new InMemoryElementRegistry() );
        connection = registry.connect( new Database( dataSource ) );
        transaction = StmTransactionContext.beginTransaction();
    }

    def "The root namespace can be looked up"() {

        when: "the root namespace is looked up"
        def rootNamespace = registry.lookUpRootNamespace().get( IRootNamespace.class );

        and: "the root namespace is looked up again"
        def rootNamespace2 = registry.lookUpRootNamespace().get( IRootNamespace.class );

        then: "it has usable attributes"
        rootNamespace.id != null;
        rootNamespace.name == '$';
        rootNamespace.summary != null;

        and: "it is the same (cached) object"
        rootNamespace2.is( rootNamespace );

    }

    def cleanup() {
        StmTransactionContext.commitTransaction( transaction );
        connection.close();
    }

    def cleanupSpec() {
        dataSource.close()
    }

}
