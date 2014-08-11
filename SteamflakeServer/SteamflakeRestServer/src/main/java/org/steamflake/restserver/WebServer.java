package org.steamflake.restserver;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.Resource;
import org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher;

import javax.servlet.DispatcherType;
import java.net.MalformedURLException;
import java.util.EnumSet;

/**
 * Jetty web server initial configuration and start up.
 */
public class WebServer {

    /**
     * Starts the app server and admin server of Steamflake. Does not return until they are stopped.
     * @throws Exception If Jetty servers do not start properly.
     */
    public static synchronized void run() throws Exception {

        // capture Jetty logging
        org.eclipse.jetty.util.log.Log.setLog( new JettyToLog4J2Logger( "Jetty" ) );

        // build the app server
        WebServer.appServer = makeAppServer();

        // build the admin server
        WebServer.adminServer = makeAdminServer();

        // start the servers
        LOG.info( "Starting application server ..." );
        WebServer.appServer.start();
        LOG.info( "Starting admin server ..." );
        WebServer.adminServer.start();

        // set up graceful shut down
        WebServer.appServer.setStopTimeout( 5000 );
        WebServer.adminServer.setStopTimeout( 5000 );

        // hang out until the app server is stopped
        WebServer.appServer.join();

    }

    /**
     * Stops the running web server.
     */
    public static void stop() {

        LOG.info( "Preparing to shut down ..." );

        Runnable stopAppServer = () -> {
            try {
                Thread.sleep( 1000 );
                WebServer.appServer.stop();
            } catch ( Exception e ) {
                LOG.error( "Failed shutdown.", e );
            }
        };

        Runnable stopAdminServer = () -> {
            try {
                Thread.sleep( 1000 );
                WebServer.adminServer.stop();
            } catch ( Exception e ) {
                LOG.error( "Failed shutdown.", e );
            }
        };

        new Thread( stopAppServer ).start();

        new Thread( stopAdminServer ).start();

    }

    private WebServer() {
        throw new UnsupportedOperationException( "Static utility class only." );
    }

    private static Server makeAdminServer() throws MalformedURLException {

        int adminPort = 8081;  // TBD: configurable

        // create the server itself
        Server adminServer = new Server();

        // configure the server connection
        ServerConnector connector = new ServerConnector( adminServer );
        connector.setPort( adminPort );
        adminServer.setConnectors( new Connector[]{ connector } );

        // TBD: serve static content
        // ContextHandler fileServerContext = makeFileServerContextHandler( tbd:config );

        // serve dynamic content
        ServletContextHandler adminServerContext = makeAdminServerContextHandler();

        // combine the two contexts plus a shutdown handler
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers( new Handler[]{ adminServerContext } );

        // configure the server for the two contexts
        adminServer.setHandler( contexts );

        return adminServer;
    }

    private static Server makeAppServer() throws MalformedURLException {

        int appPort = 8080;  // TBD: configurable

        // create the server itself
        Server appServer = new Server();

        // configure the server connection
        ServerConnector connector = new ServerConnector( appServer );
        connector.setPort( appPort );
        appServer.setConnectors( new Connector[]{ connector } );

        // serve static content
        ContextHandler fileServerContext = makeFileServerContextHandler();

        // serve dynamic content
        ServletContextHandler webServiceContext = makeWebServiceContextHandler();

        // combine the two contexts plus a shutdown handler
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers( new Handler[]{ fileServerContext, webServiceContext } );

        // configure the server for the two contexts
        appServer.setHandler( contexts );

        return appServer;
    }

    private static ServletContextHandler makeAdminServerContextHandler() {
        // set the context for dynamic content
        ServletContextHandler adminServerContext = new ServletContextHandler( ServletContextHandler.SESSIONS );
        adminServerContext.setContextPath( "/steamflakeadmin" );

        // add a shutdown servlet for the dynamic content
        // TBD: Any other stuff needed for admin ...
        ServletHolder servletHolder = new ServletHolder( new ShutdownServlet() );

        adminServerContext.addServlet( servletHolder, "/exit" );
        adminServerContext.addFilter( ThreadNameFilter.class, "/*", EnumSet.of( DispatcherType.REQUEST ) );

        return adminServerContext;
    }

    private static ServletContextHandler makeWebServiceContextHandler() {
        // set the context for dynamic content
        ServletContextHandler webServiceContext = new ServletContextHandler( ServletContextHandler.SESSIONS );
        webServiceContext.setContextPath( "/steamflakedata" );

        // add a RESTEasy servlet for the dynamic content
        ServletHolder servletHolder = new ServletHolder( new HttpServletDispatcher() );
        servletHolder.setInitParameter( "javax.ws.rs.Application", "org.steamflake.restserver.ApplicationServices" );

        webServiceContext.addServlet( servletHolder, "/*" );
        webServiceContext.addFilter( ThreadNameFilter.class, "/*", EnumSet.of( DispatcherType.REQUEST ) );

        return webServiceContext;
    }

    private static ContextHandler makeFileServerContextHandler() throws MalformedURLException {
        // set the context for static content
        ContextHandler fileServerContext = new ContextHandler();
        fileServerContext.setContextPath( "/steamflake" );

        // set the source for static content
        ResourceHandler fileResourceHandler = new ResourceHandler();
        fileResourceHandler.setCacheControl( "max-age=3600,public" );
        fileResourceHandler.setBaseResource( Resource.newResource( "/home/mnordberg/Workspace/steamflake/SteamflakeWebClient" ) );
        fileServerContext.setHandler( fileResourceHandler );

        return fileServerContext;
    }

    private static final Logger LOG = LogManager.getLogger();

    /** App server for static content and REST web services. */
    private static Server appServer;

    /** Admin server for control tasks. */
    private static Server adminServer;

}
