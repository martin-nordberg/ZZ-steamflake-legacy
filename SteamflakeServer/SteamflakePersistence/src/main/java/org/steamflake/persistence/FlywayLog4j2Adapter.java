package org.steamflake.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.flywaydb.core.internal.util.logging.Log;

/**
 * Adapter sends Flyway logging to Log4j2.
 */
public class FlywayLog4j2Adapter
    implements Log {

    public FlywayLog4j2Adapter( Class<?> clazz ) {
        this.logger = LogManager.getLogger( clazz );
    }

    @Override
    public void debug( String message ) {
        this.logger.debug( message );
    }

    @Override
    public void info( String message ) {
        this.logger.info( message );
    }

    @Override
    public void warn( String message ) {
        this.logger.warn( message );
    }

    @Override
    public void error( String message ) {
        this.logger.error( message );
    }

    @Override
    public void error( String message, Exception e ) {
        this.logger.error( message, e );
    }

    private final Logger logger;
}
