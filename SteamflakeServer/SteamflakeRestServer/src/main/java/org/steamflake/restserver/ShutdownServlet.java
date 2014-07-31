package org.steamflake.restserver;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Crude servlet shuts down the whole web server.
 */
public class ShutdownServlet
    extends HttpServlet {

    @Override
    protected void service( HttpServletRequest req, HttpServletResponse resp ) throws ServletException, IOException {

        // ask the web server to stop (asynchronously)
        try {
            WebServer.stop();
        } catch ( Exception e ) {
            throw new ServletException( e );
        }

        // respond with a simple output
        resp.getOutputStream().println( "Steamflake admin and application servers stopping..." );
        resp.setStatus( HttpServletResponse.SC_OK );
    }

}
