
package org.steamflake.restserver;

import org.steamflake.persistence.DatabaseMigration;

/**
 * Steamflake main program.
 */
public class Application {

    public static void main( String[] args ) throws Exception {
        DatabaseMigration.updateDatabaseSchema();

        WebServer.run();
    }

}
