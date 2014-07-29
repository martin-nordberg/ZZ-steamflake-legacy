package org.steamflake.restserver;

    import org.steamflake.persistence.DatabaseMigration;

    import java.util.logging.Logger;

/**
 * Steamflake main program.
 */
public class Application {

    public static void main( String[] args ) throws Exception {
        DatabaseMigration.updateDatabaseSchema();

        new WebServer().run();
    }

    private static final Logger LOGGER = Logger.getLogger( Application.class.getName() );

}
