package org.steamflake.persistence.migration;

import org.flywaydb.core.internal.util.logging.Log;
import org.flywaydb.core.internal.util.logging.LogCreator;

/**
 * Flyway logging adapter factory.
 */
class FlywayLog4j2Creator
    implements LogCreator {

    @Override
    public Log createLogger( Class<?> clazz ) {
        return new FlywayLog4j2Adapter( clazz );
    }

}
