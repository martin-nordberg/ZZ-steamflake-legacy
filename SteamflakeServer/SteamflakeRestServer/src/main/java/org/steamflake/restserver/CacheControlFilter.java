
package org.steamflake.restserver;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;

/**
 * Filter to disable caching of dynamic content.
 */
public class CacheControlFilter
    implements ContainerResponseFilter {

    /**
     * Disallows caching of dynamic content.
     * @param request The HTTP request (only GETs affected).
     * @param response The HTTP response (cache control headers set by the filter).
     */
    public void filter( ContainerRequestContext request, ContainerResponseContext response ) {
        if ( request.getMethod().equals( "GET" ) ) {
            response.getHeaders().add( "Cache-Control", "max-age=0, no-cache, no-store" );
            response.getHeaders().add( "Pragma", "no-cache" );
        }
    }
}