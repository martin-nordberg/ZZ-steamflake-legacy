package org.steamflake.utilities.revisions;

import java.util.concurrent.atomic.AtomicInteger;
import static org.steamflake.utilities.revisions.Transaction.doInTransaction;

/**
 * Main program tests Transaction usage and garbage collection.
 */
public class TransactionGarbageCollectionTest {

    public static void main( String... args ) {

        new Thread( new MetricThread() ).start();

        for ( int i=0; i<1 ; i+=1 ) {
            new Thread( new WorkerThread() ).start();
        }

    }

    static class Value {

        Value() {
            this.myCount = count.incrementAndGet();
        }

        @Override
        protected void finalize() throws Throwable {
            count.decrementAndGet();
            super.finalize();
        }

        int myCount;
        static AtomicInteger count = new AtomicInteger( 0 );

    }

    static class WorkerThread implements Runnable {

        @Override
        public void run() {
            try {
                doInTransaction( 2, () -> {
                    this.myValue = new Ver<>( new Value() );
                } );
                for ( int i = 0; i < 100000; i += 1 ) {
                    doInTransaction( 5, () -> {
                        this.myValue.set( new Value() );
                    } );
                    if ( i % 100 == 0 ) {
                        Thread.yield();
                    }
//                    if ( i % 1000 == 0 ) {
//                        System.gc();
//                    }
                }
            }
            catch ( Exception e ) {
                e.printStackTrace();
//                System.out.println( "WORKER THREAD EXCEPTION: " + e.getMessage() );
            }
        }

        private Ver<Value> myValue;

    }

    static class MetricThread implements Runnable {

        @Override
        public void run() {
            int priorCount = -1;
            while ( true ) {
                int count = Value.count.get();
                if ( count != priorCount ) {
                    System.out.println( count );
                    priorCount = count;
                }
                System.gc();
            }
        }

    }

}
