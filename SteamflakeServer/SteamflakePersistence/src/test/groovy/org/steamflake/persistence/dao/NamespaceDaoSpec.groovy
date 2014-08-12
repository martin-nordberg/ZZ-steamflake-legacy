package org.steamflake.persistence.dao

import fi.evident.dalesbred.Database
import org.steamflake.metamodel.impl.Namespace
import org.steamflake.persistence.h2database.H2DataSource
import org.steamflake.persistence.migration.DatabaseMigration
import org.steamflake.utilities.uuids.Uuids
import spock.lang.Specification

/**
 * Specification for namespace data access.
 */
class NamespaceDaoSpec extends Specification {

    static H2DataSource dataSource
    Database database
    NamespaceDao dao

    def setupSpec() {
        dataSource = new H2DataSource();
    }

    def setup() {
        database = new Database( dataSource );
        dao = new NamespaceDao( database );
    }

    def "A namespace can be created, read, and deleted" () {

        given: "a namespace to be saved"
        def namespace = new Namespace( Uuids.makeUuid(), "example", "a testing sample namespace" )

        when: "the namespace is created"
        dao.createNamespace( namespace )

        and: "retrieved by UUID"
        def namespace2 = dao.findNamespaceByUuid( namespace.uuid )

        then: "it matches the original"
        namespace2.uuid == namespace.uuid
        namespace2.name == namespace.name
        namespace2.summary == namespace.summary

        and: "it can be deleted"
        dao.deleteNamespace( namespace.uuid )

    }

    def cleanupSpec() {
        dataSource.close()
    }

}
