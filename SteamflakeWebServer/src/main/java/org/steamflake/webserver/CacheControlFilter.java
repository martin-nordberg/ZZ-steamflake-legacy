package org.steamflake.webserver;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;

/**
 * Filter to disable caching of dynamic content.
 */
public class CacheControlFilter
    implements ContainerResponseFilter {

    public void filter( ContainerRequestContext request, ContainerResponseContext response ) {
        if ( request.getMethod().equals( "GET" ) ) {
            response.getHeaders().add( "Cache-Control", "max-age=0, no-cache, no-store" );
            response.getHeaders().add( "Pragma", "no-cache" );
        }
    }
}