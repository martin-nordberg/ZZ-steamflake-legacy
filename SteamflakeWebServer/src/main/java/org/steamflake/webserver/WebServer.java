package org.steamflake.webserver;

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

/**
 * Jetty web server initial configuration and start up.
 */
public class WebServer {

    public void run() throws Exception {

        // create the server itself
        Server server = new Server();

        // configure the server connection
        ServerConnector connector = new ServerConnector( server );
        connector.setPort( 8080 );
        server.setConnectors( new Connector[]{ connector } );


        // set the context for static content
        ContextHandler fileServerContext = new ContextHandler();
        fileServerContext.setContextPath( "/steamflake" );

        // set the source for static content
        ResourceHandler fileResourceHandler = new ResourceHandler();
        fileResourceHandler.setCacheControl( "max-age=3600,public" );
        fileResourceHandler.setBaseResource( Resource.newResource( "/home/mnordberg/Workspace/steamflake/SteamflakeWebClient" ) );
        fileServerContext.setHandler( fileResourceHandler );


        // set the context for dynamic content
        ServletContextHandler webServiceContext = new ServletContextHandler( ServletContextHandler.SESSIONS );
        webServiceContext.setContextPath( "/steamflakedata" );

        // add a RESTEasy servlet for the dynamic content
        ServletHolder servletHolder = new ServletHolder( new HttpServletDispatcher() );
        servletHolder.setInitParameter( "javax.ws.rs.Application", "org.steamflake.webserver.ApplicationServices" );

        webServiceContext.addServlet( servletHolder, "/*" );


        // combine the two contexts
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers( new Handler[]{ fileServerContext, webServiceContext } );

        // configure the server for the two contexts
        server.setHandler( contexts );

        // start the server
        server.start();
        server.join();

    }

}
