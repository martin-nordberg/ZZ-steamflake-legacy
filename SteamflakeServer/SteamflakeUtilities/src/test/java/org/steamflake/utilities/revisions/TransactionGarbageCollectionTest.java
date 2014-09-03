package org.steamflake.utilities.revisions;

import java.util.concurrent.atomic.AtomicInteger;

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
                Runnable task1 = () -> {
                    this.myValue = new V<>( new Value() );
                };
                StmTransactionContext.doInTransaction( 2, task1 );
                for ( int i = 0; i < 50000; i += 1 ) {
                    Runnable task = () -> {
                        this.myValue.set( new Value() );
                    };
                    StmTransactionContext.doInTransaction( 5, task );
                    if ( i % 100 == 0 ) {
                        Thread.yield();
                    }
                }
            }
            catch ( Exception e ) {
                e.printStackTrace();
            }
        }

        private V<Value> myValue;

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
