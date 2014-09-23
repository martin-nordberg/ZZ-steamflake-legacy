package org.steamflake.utilities.configuration;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * General purpose configuration settings from properties files.
 */
public class Configuration {

    /**
     * Constricts a configuration object using the properties file corresponding to a given class.
     *
     * @param classInPkgWithConfig the class with a corresponding .properties file.
     */
    public Configuration( Class<?> classInPkgWithConfig ) {

        // TBD: also open external properties file

        this.properties = new Properties();

        try {

            // Build the properties file name from the class name.
            String fileName = classInPkgWithConfig.getSimpleName() + ".properties";

            // Open the properties file as a classpath resource.
            InputStream stream = classInPkgWithConfig.getResourceAsStream( fileName );

            // Must be present.
            if ( stream == null ) {
                throw new IllegalArgumentException( "No properties file found for class " + classInPkgWithConfig.getName() + "." );
            }

            // Load the properties file.
            this.properties.load( stream );

        }
        catch ( IOException e ) {

            throw new IllegalArgumentException( "Failed to open properties file for class " + classInPkgWithConfig.getName() + "." );

        }

    }

    /**
     * Reads the property for the given key.
     *
     * @param key the key of the property to read.
     * @return the property value read.
     */
    public String readString( String key ) {

        // TBD: read from external properties first, then internal as fallback

        return this.properties.getProperty( key );

    }

    /**
     * The properties file where the configuration comes from.
     */
    private final Properties properties;

}
