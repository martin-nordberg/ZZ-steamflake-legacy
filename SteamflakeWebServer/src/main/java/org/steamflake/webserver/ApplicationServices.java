package org.steamflake.webserver;

import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

/**
 * Registry of services for RESTEasy.
 */
public class ApplicationServices
    extends Application {

    public ApplicationServices() {
        // register RESTful services
        singletons.add( new HelloService() );

        // register filters
        singletons.add( new CacheControlFilter() );

        // register mappers
        singletons.add( new StuffMapper() );
    }

    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }

    private static Set<Object> singletons = new HashSet<>();

}

