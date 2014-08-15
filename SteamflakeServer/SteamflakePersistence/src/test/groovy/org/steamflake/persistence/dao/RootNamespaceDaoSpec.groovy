package org.steamflake.persistence.dao

import fi.evident.dalesbred.Database
import org.steamflake.persistence.h2database.H2DataSource
import spock.lang.Specification

/**
 * Specification for root namespace data access.
 */
class RootNamespaceDaoSpec extends Specification {

    static H2DataSource dataSource
    Database database
    RootNamespaceDao dao

    def setupSpec() {
        dataSource = new H2DataSource();
    }

    def setup() {
        database = new Database( dataSource );
        dao = new RootNamespaceDao( database );
    }

    def "The root namespace can be read" () {

        when: "the root namespace is read"
        def rootNamespace = dao.findRootNamespace()

        then: "it has usable attributes"
        rootNamespace.id != null
        rootNamespace.name == '$'
        rootNamespace.summary != null

    }

    def cleanupSpec() {
        dataSource.close()
    }

}
