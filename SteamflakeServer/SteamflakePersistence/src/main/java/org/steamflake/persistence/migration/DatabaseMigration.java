package org.steamflake.persistence.migration;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.internal.util.logging.LogFactory;

import javax.sql.DataSource;

/**
 * Static utility class to update the database schema.
 */
public class DatabaseMigration {

    /**
     * Updates the database schema to the latest version.
     */
    public static void updateDatabaseSchema( DataSource dataSource ) {

        LOG.info( "Updating database schema..." );

        // send Flyway logging to Log4j2
        LogFactory.setLogCreator( new FlywayLog4j2Creator() );

        // create the Flyway instance
        Flyway flyway = new Flyway();

        // point it to the database
        flyway.setDataSource( dataSource );

        // start the migration
        flyway.migrate();

    }

    private static final Logger LOG = LogManager.getLogger( DatabaseMigration.class );

}
