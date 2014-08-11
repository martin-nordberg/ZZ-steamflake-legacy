package org.steamflake.persistence;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.internal.util.logging.LogFactory;

/**
 * Static utility class to update the database schema.
 */
public class DatabaseMigration {

    /**
     * Updates the database schema to the latest version.
     */
    public static void updateDatabaseSchema() {

        LOG.info( "Updating database schema..." );

        // Send Flyway logging to Log4j2
        LogFactory.setLogCreator( new FlywayLog4j2Creator() );

        // Create the Flyway instance
        Flyway flyway = new Flyway();

        // Point it to the database
        flyway.setDataSource( "jdbc:h2:./target/example/database", "sa", "sa" );

        // Start the migration
        flyway.migrate();

    }

    private static final Logger LOG = LogManager.getLogger( DatabaseMigration.class.getName() );

}
