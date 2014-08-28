package org.steamflake.utilities.revisions

import spock.lang.Specification

/**
 * Simple exercising of Transactions.
 */
class TransactionSpec extends Specification {

    def "Transactions allow a versioned item to be created and changed" () {

        given:
        Ver<Integer> stuff
        StmTransactionContext.doInTransaction( 1 ) {
            stuff = new Ver<>( 1 );
        }

        when:
        StmTransactionContext.doInTransaction( 1 ) {
            stuff.set( 2 );
        }

        then:
        StmTransactionContext.doInTransaction( 1 ) {
            assert stuff.get() == 2
        }

    }

}
