package org.steamflake.persistence.h2database;

import org.apache.logging.log4j.LogManager;
import org.h2.jdbcx.JdbcConnectionPool;
import org.steamflake.persistence.migration.DatabaseMigration;
import org.steamflake.utilities.configuration.Configuration;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.logging.Logger;

/**
 * Wrapper for an H2 data source with pooled connections.
 */
public class H2DataSource
    implements AutoCloseable, DataSource {

    /**
     * Constructs a new H2 data source.
     */
    public H2DataSource() {

        // Read the database configuration.
        Configuration config = new Configuration( H2DataSource.class );
        String url = config.readString( "url" );
        String username = config.readString( "username" );
        String password = config.readString( "password" );

        LOG.info( "Opening data source: URL = {}, User Name = {}", url, username );

        // Create a connection pool.
        this.connectionPool = JdbcConnectionPool.create( url, username, password );

        // Update the schema if needed.
        DatabaseMigration.updateDatabaseSchema( this );

    }

    @Override
    public void close() {

        LOG.info( "Closing data source" );

        this.connectionPool.dispose();

    }

    @Override
    public Connection getConnection() throws SQLException {
        return this.connectionPool.getConnection();
    }

    @Override
    public Connection getConnection( String username, String password ) throws SQLException {
        return this.connectionPool.getConnection( username, password );
    }

    @Override
    public PrintWriter getLogWriter() throws SQLException {
        return this.connectionPool.getLogWriter();
    }

    @Override
    public int getLoginTimeout() throws SQLException {
        return this.connectionPool.getLoginTimeout();
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        throw new SQLFeatureNotSupportedException( "Parent logger not supported" );
    }

    @Override
    public boolean isWrapperFor( Class<?> iface ) throws SQLException {
        return this.connectionPool.isWrapperFor( iface );
    }

    @Override
    public void setLogWriter( PrintWriter out ) throws SQLException {
        this.connectionPool.setLogWriter( out );
    }

    @Override
    public void setLoginTimeout( int seconds ) throws SQLException {
        this.connectionPool.setLoginTimeout( seconds );
    }

    @Override
    public <T> T unwrap( Class<T> iface ) throws SQLException {
        return this.connectionPool.unwrap( iface );
    }

    /** The logger for this class. */
    private static final org.apache.logging.log4j.Logger LOG = LogManager.getLogger();

    /** The underlying connection pool delegated to by this data source. */
    private final JdbcConnectionPool connectionPool;

}
