package org.steamflake.persistence;

import java.util.logging.Logger;

import org.flywaydb.core.Flyway;

/**
 * Static utility class to update the database schema.
 */
public class DatabaseMigration {

    /**
     * Updates the database schema to the latest version.
     */
    public static void updateDatabaseSchema() {

        LOGGER.info( "Updating database schema..." );

        // Create the Flyway instance
        Flyway flyway = new Flyway();

        // Point it to the database
        flyway.setDataSource( "jdbc:h2:./target/example/database", "sa", "sa" );

        // Start the migration
        flyway.migrate();

    }

    private static final Logger LOGGER = Logger.getLogger( DatabaseMigration.class.getName() );

}
