package org.steamflake.utilities.revisions

import org.steamflake.utilities.configuration.Configuration
import spock.lang.Specification

/**
 * Simple exercising of Transactions.
 */
class TransactionSpec extends Specification {

    def "Transactions allow a versioned item to be created and changed" () {

        given:
        Ver<Integer> stuff
        Transaction.doInTransaction( 1 ) {
            stuff = new Ver<>( 1 );
        }

        when:
        Transaction.doInTransaction( 1 ) {
            stuff.set( 2 );
        }

        then:
        Transaction.doInTransaction( 1 ) {
            assert stuff.get() == 2
        }

    }

}
