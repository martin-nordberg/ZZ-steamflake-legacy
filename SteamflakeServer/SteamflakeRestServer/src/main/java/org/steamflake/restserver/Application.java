
package org.steamflake.restserver;

import org.steamflake.persistence.h2database.H2DataSource;
import org.steamflake.persistence.migration.DatabaseMigration;

/**
 * Steamflake main program.
 */
public class Application {

    public static void main( String[] args ) throws Exception {

        DatabaseMigration.updateDatabaseSchema();

        try( H2DataSource dataSource = new H2DataSource() ) {

            WebServer.run();

        }

    }

}
