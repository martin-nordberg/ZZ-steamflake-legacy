package org.steamflake.utilities.revisions

import spock.lang.Specification

/**
 * Simple exercising of Transactions.
 */
class TransactionSpec extends Specification {

    def "Transactions allow a versioned item to be created and changed"() {

        given:
        V<Integer> stuff
        StmTransactionContext.doInTransaction(1) {
            stuff = new V<>(1);
        }

        when:
        StmTransactionContext.doInTransaction(1) {
            stuff.set(2);
        }

        then:
        StmTransactionContext.doInTransaction(1) {
            assert stuff.get() == 2
        }

    }

    def "Transactions allow a versioned list to be created and changed"() {

        given:
        VList<Integer> stuff
        StmTransactionContext.doInTransaction(1) {
            stuff = new VList<>();
        }

        when:
        StmTransactionContext.doInTransaction(1) {
            stuff.add(2);
            stuff.add(3);
        }

        and:
        StmTransactionContext.doInTransaction(1) {
            stuff.remove(2);
            stuff.add(4);
        }

        and:
        StmTransactionContext.doInTransaction(1) {
            stuff.add(5);
        }

        then:
        def stList = null;
        StmTransactionContext.doInTransaction(1) {
            stList = stuff.get();
        }
        assert stList.get(0) == 3;
        assert stList.get(1) == 4;
        assert stList.get(2) == 5;
        assert stList.size() == 3;


    }

}
