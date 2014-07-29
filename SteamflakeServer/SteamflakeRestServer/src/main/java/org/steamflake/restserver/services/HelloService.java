package org.steamflake.restserver.services;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * Simple hello world REST service.
 */
@Path("/hello")
public class HelloService {

    @GET
    @Path("extra")
    @Produces({ "application/json", "application/vnd.steamflake.org.v1.stuff+json" })
    public Stuff helloExtraGet() {
        return new Stuff( 100 );
    }

    @GET
    @Produces("application/json")
    public Response helloGet() {
        return Response.status( 200 ).entity( "{ \"message\": \"Hello\" }" ).build();
    }

    @POST
    public Response helloPost() {
        return Response.status( 200 ).entity( "HTTP POST method called" ).build();
    }

}

