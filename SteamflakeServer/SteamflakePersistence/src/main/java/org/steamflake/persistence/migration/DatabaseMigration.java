package org.steamflake.persistence.migration;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.internal.util.logging.LogFactory;

import javax.sql.DataSource;

/**
 * Static utility class to update the database schema.
 */
public final class DatabaseMigration {

    /**
     * Static utility class not intended for instantiation.
     */
    private DatabaseMigration() {
        throw new UnsupportedOperationException( "Static utility class." );
    }

    /**
     * Updates the database schema to the latest version.
     */
    public static void updateDatabaseSchema( DataSource dataSource ) {

        LOG.info( "Updating database schema..." );

        // Send Flyway logging to Log4j2.
        LogFactory.setLogCreator( new FlywayLog4j2Creator() );

        // Create the Flyway instance.
        Flyway flyway = new Flyway();

        // Point it to the database.
        flyway.setDataSource( dataSource );

        // Start the migration.
        flyway.migrate();

    }

    /**
     * The logger for this class.
     */
    private static final Logger LOG = LogManager.getLogger();

}
