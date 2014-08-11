package org.steamflake.restserver;

import org.apache.logging.log4j.LogManager;
import org.eclipse.jetty.util.log.Logger;

/**
 * Adapter routes Jetty logging into Log4J2.
 */
public class JettyToLog4J2Logger
    implements Logger {

    public JettyToLog4J2Logger( String name ) {
        this.logger = LogManager.getLogger( name );
    }

    @Override
    public void debug( String msg, Object... args ) {
        if ( logger.isDebugEnabled() ) {
            this.logger.debug( this.format( msg, args ) );
        }
    }

    @Override
    public void debug( String msg, long value ) {
        this.logger.debug( msg, value );
    }

    @Override
    public void debug( Throwable thrown ) {
        this.logger.debug( "", thrown );
    }

    @Override
    public void debug( String msg, Throwable thrown ) {
        this.logger.debug( msg, thrown );
    }

    @Override
    public Logger getLogger( String name ) {
        return new JettyToLog4J2Logger( name );
    }

    @Override
    public String getName() {
        return this.logger.getName();
    }

    @Override
    public void ignore( Throwable ignored ) {
        // TBD
    }

    @Override
    public void info( String msg, Object... args ) {
        if ( logger.isInfoEnabled() ) {
            this.logger.info( this.format( msg, args ) );
        }
    }

    @Override
    public void info( Throwable thrown ) {
        this.logger.info( "", thrown );
    }

    @Override
    public void info( String msg, Throwable thrown ) {
        this.logger.info( msg, thrown );
    }

    @Override
    public boolean isDebugEnabled() {
        return this.logger.isDebugEnabled();
    }

    @Override
    public void setDebugEnabled( boolean enabled ) {
        // TBD
    }

    @Override
    public void warn( String msg, Object... args ) {
        if ( logger.isWarnEnabled() ) {
            this.logger.warn( this.format( msg, args ) );
        }
    }

    @Override
    public void warn( Throwable thrown ) {
        this.logger.warn( "", thrown );
    }

    @Override
    public void warn( String msg, Throwable thrown ) {
        this.logger.warn( msg, thrown );
    }

    private String format( String msg, Object... args ) {

        msg = String.valueOf( msg ); // Avoids NPE

        String braces = "{}";

        StringBuilder builder = new StringBuilder();

        int start = 0;

        for ( Object arg : args ) {
            int bracesIndex = msg.indexOf( braces, start );

            if ( bracesIndex < 0 ) {
                builder.append( msg.substring( start ) );
                builder.append( " " );
                builder.append( arg );
                start = msg.length();
            }
            else {
                builder.append( msg.substring( start, bracesIndex ) );
                builder.append( String.valueOf( arg ) );
                start = bracesIndex + braces.length();
            }
        }

        builder.append( msg.substring( start ) );

        return builder.toString();
    }

    private final org.apache.logging.log4j.Logger logger;

}
