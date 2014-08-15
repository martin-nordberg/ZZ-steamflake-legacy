package org.steamflake.persistence.dao

import fi.evident.dalesbred.Database
import org.steamflake.metamodel.impl.Namespace
import org.steamflake.persistence.h2database.H2DataSource
import org.steamflake.utilities.uuids.Uuids
import spock.lang.Ignore
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
        def namespace = new Namespace( Uuids.makeUuid().toString(), "example", "a testing sample namespace" )

        when: "the namespace is created"
        dao.createNamespace( namespace )

        and: "retrieved by UUID"
        def namespace2 = dao.findNamespaceByUuid( namespace.id )

        then: "it matches the original"
        namespace2.id == namespace.id
        namespace2.name == namespace.name
        namespace2.summary == namespace.summary

        and: "it can be deleted"
        dao.deleteNamespace( namespace.id )

    }

    @Ignore
    def "it takes a while to create lots of namespaces" () {

        when: "the namespaces are created"
        for ( int i = 0 ; i< 100000 ; i+=1 ) {
            def namespace = new Namespace(Uuids.makeUuid().toString(), "example"+i, "a testing sample namespace")
            dao.createNamespace(namespace)
        }

        then: "they can be retrieved"
        dao.findNamespacesAll()

    }

    def cleanupSpec() {
        dataSource.close()
    }

}
