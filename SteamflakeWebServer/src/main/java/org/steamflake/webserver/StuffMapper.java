package org.steamflake.webserver;

import javax.json.Json;
import javax.json.stream.JsonGenerator;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.logging.Logger;

/**
 * Hello world domain entity JSON mapper.
 */
@Provider
public class StuffMapper
    implements MessageBodyWriter<Object> {

    @Override
    public long getSize( Object arg0, Class<?> arg1, Type arg2, Annotation[] arg3, MediaType arg4 ) {
        return -1;
    }

    @Override
    public boolean isWriteable( Class<?> clazz, Type type, Annotation[] annotations, MediaType mediaType ) {

        LOGGER.info( "class: " + clazz.getName() );
        LOGGER.info( "media type: " + mediaType.getType() );
        LOGGER.info( "media subtype: " + mediaType.getSubtype() );

        boolean result = "org.steamflake.webserver".equals( clazz.getPackage().getName() );
        result = result && mediaType.getType().equals( "application" );
        result = result && mediaType.getSubtype().matches( "(vnd\\.steamflake\\.org\\.v1\\..*\\+)?json" );
        return result;

    }

    @Override
    public void writeTo( Object object, Class<?> clazz, Type type, Annotation[] annotation, MediaType mediaType, MultivaluedMap<String, Object> map, OutputStream out ) throws IOException, WebApplicationException {
        if ( object instanceof Stuff ) {
            JsonGenerator gen = Json.createGenerator( out );
            gen.writeStartObject().write( "thecount", ((Stuff) object).getCount() ).writeEnd();
            gen.close();
        }
    }

    private static final Logger LOGGER = Logger.getLogger( StuffMapper.class.getName() );
}