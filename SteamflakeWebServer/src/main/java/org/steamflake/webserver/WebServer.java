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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by mnordberg on 7/21/14.
 */
public class WebServer {

    public void run() throws Exception {

        // create the server itself
        Server server = new Server();

        // configure the server connection
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(8080);
        server.setConnectors(new Connector[] { connector } );


        // set the context for static content
        ContextHandler context0 = new ContextHandler();
        context0.setContextPath("/steamflake");

        // set the source for static content
        ResourceHandler rh0 = new ResourceHandler();
        rh0.setBaseResource(Resource.newResource("/home/mnordberg/Workspace/steamflake/SteamflakeWebClient"));
        context0.setHandler(rh0);


        // set the context for dynamic content
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/steamflakedata");

        // add a servlet for the dynamic content -- TBD: RESTEasy Servlet here
        context.addServlet(new ServletHolder(new HelloServlet()), "/*");


        // combine the two contexts
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers(new Handler[] {context0, context});

        // configure the server for the two contexts
        server.setHandler(contexts);

        // start the server
        server.start();
        server.join();

    }

    @SuppressWarnings("serial")
    public static class HelloServlet extends HttpServlet
    {
        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
        {
            response.setContentType("text/html");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("<h1>Hello SimpleServlet</h1>");
        }
    }

}
