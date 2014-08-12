
package org.steamflake.restserver;

import org.steamflake.persistence.h2database.H2DataSource;

/**
 * Steamflake main program.
 */
public class Application {

    public static void main( String[] args ) throws Exception {

        try( H2DataSource dataSource = new H2DataSource() ) {

            WebServer.run();

        }

    }

}
