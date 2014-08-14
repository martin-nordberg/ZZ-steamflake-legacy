
package org.steamflake.restserver;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.steamflake.persistence.h2database.H2DataSource;

/**
 * Steamflake main program.
 */
public class Application {

    public static void main( String[] args ) throws Exception {

        LOG.info( "Application started." );

        try ( H2DataSource dataSource = new H2DataSource() ) {

            WebServer.run();

        }

        LOG.info( "Application stopped." );

    }

    private static final Logger LOG = LogManager.getLogger();

}