package org.steamflake.persistence.registry

import fi.evident.dalesbred.Database
import org.steamflake.metamodel.api.structure.entities.IRootNamespace
import org.steamflake.metamodel.impl.registry.InMemoryElementRegistry
import org.steamflake.persistence.h2database.H2DataSource
import org.steamflake.utilities.revisions.StmTransaction
import org.steamflake.utilities.revisions.StmTransactionContext
import spock.lang.Specification

/**
 * Created by mnordberg on 9/8/14.
 */
class DatabaseElementRegistrySpec extends Specification {

    static H2DataSource dataSource
    Database database
    DatabaseElementRegistry registry
    StmTransaction transaction

    def setupSpec() {
        dataSource = new H2DataSource();
    }

    def setup() {
        database = new Database(dataSource);
        registry = new DatabaseElementRegistry(new InMemoryElementRegistry(), database);
        transaction = StmTransactionContext.beginTransaction();
    }

    def "The root namespace can be looked up"() {

        when: "the root namespace is looked up"
        def rootNamespace = registry.lookUpRootNamespace().get(IRootNamespace.class)

        and: "the root namespace is looked up again"
        def rootNamespace2 = registry.lookUpRootNamespace().get(IRootNamespace.class)

        then: "it has usable attributes"
        rootNamespace.id != null
        rootNamespace.name == '$'
        rootNamespace.summary != null

        and: "it is the same (cached) object"
        rootNamespace2.is(rootNamespace)

    }

    def cleanup() {
        StmTransactionContext.commitTransaction(transaction);
    }

    def cleanupSpec() {
        dataSource.close()
    }

}
