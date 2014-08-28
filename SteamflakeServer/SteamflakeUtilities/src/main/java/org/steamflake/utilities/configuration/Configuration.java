package org.steamflake.utilities.configuration;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * General purpose configuration settings for SteamflakeServer.
 */
public class Configuration {

    public Configuration( Class<?> classInPkgWithConfig ) {

        // TBD: also open external properties file

        this.properties = new Properties();
        try {
            String fileName = classInPkgWithConfig.getSimpleName() + ".properties";

            InputStream stream = classInPkgWithConfig.getResourceAsStream( fileName );

            if ( stream == null ) {
                throw new IllegalArgumentException( "No properties file found for class " + classInPkgWithConfig.getName() + "." );
            }

            this.properties.load( stream );
        }
        catch ( IOException e ) {
            throw new IllegalArgumentException( "Failed to open properties file for class " + classInPkgWithConfig.getName() + "." );
        }

    }

    public String readString( String key ) {

        // TBD: read from external properties first, then internal as fallback

        return this.properties.getProperty( key );
    }

    private final Properties properties;
}
