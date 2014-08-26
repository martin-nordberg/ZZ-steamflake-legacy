package org.steamflake.utilities.revisions;

import java.util.concurrent.atomic.AtomicInteger;
import static org.steamflake.utilities.revisions.Transaction.doInTransaction;

/**
 * Main program tests Transaction usage and garbage collection.
 */
public class TransactionGarbageCollectionTest {

    public static void main( String... args ) {

        new Thread( new MetricThread() ).start();

        for ( int i=0; i<5 ; i+=1 ) {
            new Thread( new WorkerThread() ).start();
        }

        new Thread( new GarbageCollectionThread() ).start();

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
                for ( int i = 0; i < 50000; i += 1 ) {
                    doInTransaction( 5, () -> {
                        this.myValue.set( new Value() );
                    } );
                    if ( i % 100 == 0 ) {
                        Thread.yield();
                    }
                }
            }
            catch ( Exception e ) {
                e.printStackTrace();
            }
        }

        private Ver<Value> myValue;

    }

    static class MetricThread implements Runnable {

        @Override
        public void run() {
            int priorCount = -1;
            int count = Value.count.get();
            while ( count > 10 || priorCount < 10 ) {
                if ( count != priorCount ) {
                    System.out.println( count );
                    priorCount = count;
                }
                count = Value.count.get();
            }
            System.out.println( count );
        }

    }

    static class GarbageCollectionThread implements Runnable {

        @Override
        public void run() {

            while ( Value.count.get() <= 10 ) {
                Thread.yield();
            }

            while ( Value.count.get() > 10 ) {
                try {
                    Thread.sleep( 5000L );
                    System.gc();
                }
                catch ( InterruptedException e ) {
                    e.printStackTrace();
                }
            }

        }
    }

}
