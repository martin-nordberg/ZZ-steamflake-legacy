package org.steamflake.persistence.dao

import fi.evident.dalesbred.Database
import org.steamflake.metamodel.structure.IAbstractNamespace
import org.steamflake.metamodel.structure.INamespace
import org.steamflake.metamodel.structure.IRootNamespace
import org.steamflake.metamodelimpl.registry.InMemoryModelElementRegistry
import org.steamflake.persistence.h2database.H2DataSource
import org.steamflake.utilities.revisions.StmTransaction
import org.steamflake.utilities.revisions.StmTransactionContext
import org.steamflake.utilities.uuids.Uuids
import spock.lang.Ignore
import spock.lang.Specification

/**
 * Specification for namespace data access.
 */
class NamespaceDaoSpec extends Specification {

    static H2DataSource dataSource
    Database database
    RootNamespaceDao rootDao
    NamespaceDao dao
    StmTransaction transaction
    IRootNamespace root

    def setupSpec() {
        dataSource = new H2DataSource();
    }

    def setup() {
        def cache = new InMemoryModelElementRegistry()
        database = new Database(dataSource);
        rootDao = new RootNamespaceDao(database, cache);
        dao = new NamespaceDao(database, cache);
        transaction = StmTransactionContext.beginTransaction();
        root = rootDao.findRootNamespace()
    }

    def "A namespace can be created, read, and deleted"() {

        given: "a namespace to be saved"
        def id = Uuids.makeUuid();
        INamespace namespace = root.makeNamespace(id, "example", "a testing sample namespace")

        when: "the namespace is created"
        dao.createNamespace(namespace)

        and: "retrieved by UUID"
        def namespace2 = dao.findNamespaceByUuid(id)

        then: "it is the same (cached) object as the original"
        namespace2.is(namespace)

        and: "it can be deleted"
        dao.deleteNamespace(id)

        and: "then disappears from view"
        dao.findNamespaceByUuid(id) == null

    }

    @Ignore
    def "it takes a while to create lots of namespaces"() {

        when: "the namespaces are created"
        IAbstractNamespace namespace = root
        for (int i = 0; i < 100000; i += 1) {
            def id = Uuids.makeUuid();
            namespace = namespace.makeNamespace(id, "example" + i, "testing sample namespace " + i)
            dao.createNamespace(namespace)
        }

        then: "they can be retrieved"
        dao.findNamespacesAll()

    }

    def cleanup() {
        StmTransactionContext.commitTransaction(transaction);
    }

    def cleanupSpec() {
        dataSource.close()
    }

}
