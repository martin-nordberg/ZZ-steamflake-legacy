package org.steamflake.persistence.registry

import fi.evident.dalesbred.Database
import org.steamflake.persistence.h2database.H2DataSource
import org.steamflake.utilities.revisions.StmTransaction
import org.steamflake.utilities.revisions.StmTransactionContext
import spock.lang.Specification

/**
 * Created by mnordberg on 9/8/14.
 */
class DatabaseModelElementRegistrySpec extends Specification {

    static H2DataSource dataSource
    Database database
    DatabaseModelElementRegistry registry
    StmTransaction transaction

    def setupSpec() {
        dataSource = new H2DataSource();
    }

    def setup() {
        database = new Database(dataSource);
        registry = new DatabaseModelElementRegistry( database );
        transaction = StmTransactionContext.beginTransaction();
    }

    def "The root namespace can be looked up"() {

        when: "the root namespace is looked up"
        def rootNamespace = registry.lookUpRootNamespace().get().get()

        and: "the root namespace is looked up again"
        def rootNamespace2 = registry.lookUpRootNamespace().get().get()

        then: "it has usable attributes"
        rootNamespace.id != null
        rootNamespace.name == '$'
        rootNamespace.summary != null

        and: "it is the same (cached) object"
        rootNamespace2.is( rootNamespace )

    }

    def cleanup() {
        StmTransactionContext.commitTransaction(transaction);
    }

    def cleanupSpec() {
        dataSource.close()
    }

}
