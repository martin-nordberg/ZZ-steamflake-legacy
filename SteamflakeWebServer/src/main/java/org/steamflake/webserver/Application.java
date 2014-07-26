package org.steamflake.webserver;

import org.flywaydb.core.Flyway;

import java.util.logging.Logger;

/**
 * Steamflake main program.
 */
public class Application {

    public static void main( String[] args ) throws Exception {
        Application.updateDatabaseSchema();

        new WebServer().run();
    }

    /**
     * Updates the database schema to the latest version.
     */
    private static void updateDatabaseSchema() {

        LOGGER.info( "Updating database schema..." );

        // Create the Flyway instance
        Flyway flyway = new Flyway();

        // Point it to the database
        flyway.setDataSource( "jdbc:h2:./target/example/database", "sa", "sa" );

        // Start the migration
        flyway.migrate();

    }

    private static final Logger LOGGER = Logger.getLogger( Application.class.getName() );

}
