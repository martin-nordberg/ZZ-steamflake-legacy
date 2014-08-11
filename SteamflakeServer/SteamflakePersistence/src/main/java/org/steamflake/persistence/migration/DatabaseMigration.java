package org.steamflake.persistence.migration;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.internal.util.logging.LogFactory;
import org.steamflake.persistence.h2database.H2DataSource;
import org.steamflake.utilities.configuration.Configuration;

/**
 * Static utility class to update the database schema.
 */
public class DatabaseMigration {

    /**
     * Updates the database schema to the latest version.
     */
    public static void updateDatabaseSchema() {

        LOG.info( "Updating database schema..." );

        // send Flyway logging to Log4j2
        LogFactory.setLogCreator( new FlywayLog4j2Creator() );

        // create the Flyway instance
        Flyway flyway = new Flyway();

        // point it to the database
        Configuration config = new Configuration( H2DataSource.class );
        flyway.setDataSource( config.readString( "url" ), config.readString( "username" ), config.readString( "password" ) );

        // start the migration
        flyway.migrate();

    }

    private static final Logger LOG = LogManager.getLogger( DatabaseMigration.class );

}
