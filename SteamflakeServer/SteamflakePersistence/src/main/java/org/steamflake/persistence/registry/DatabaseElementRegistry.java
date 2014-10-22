package org.steamflake.persistence.registry;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.api.elements.IElement;
import org.steamflake.metamodel.api.elements.IElementLookUp;
import org.steamflake.metamodel.api.elements.IEntity;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;
import org.steamflake.metamodel.api.structure.entities.IRootNamespace;
import org.steamflake.metamodel.impl.registry.AbstractElementLookUp;
import org.steamflake.persistence.dao.NamespaceDao;
import org.steamflake.persistence.dao.RootNamespaceDao;

import java.io.Closeable;
import java.io.IOException;
import java.util.UUID;

/**
 * Registry implementation that does database look ups for elements.
 */
public final class DatabaseElementRegistry
    extends AbstractElementLookUp
    implements IElementLookUp {

    class DatabaseConnection
        implements Closeable {

        @Override
        public void close() throws IOException {
            DatabaseElementRegistry.this.database.set( null );
        }

    }

    /**
     * Constructs a new database-backed element look up facility.
     */
    public DatabaseElementRegistry( IElementRegistry registry ) {
        this.database = new ThreadLocal<>();
        this.registry = registry;
        this.rootNamespaceId = null;
    }

    /**
     * Connects this registry to the given database. Returns a connection to be closed when completed.
     * @param database the database to conect to.
     * @return the connection to be closed when operation complete.
     */
    public final Closeable connect( Database database ) {

        if ( this.isConnected() ) {
            throw new IllegalStateException( "Already connected to database." );
        }

        this.database.set( database );

        return new DatabaseConnection();

    }

    /**
     * @return whether this registry is connected to a database (in the current thread).
     */
    public final boolean isConnected() {
        return this.database.get() != null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public final <Element extends IElement> Ref<Element> lookUpElementByUuid( Class<Element> entityType, UUID id ) {

        String typeName = entityType.getSimpleName();

        // TBD: will not be easy to make this work for abstract entity types

        switch ( typeName ) {
            case "INamespace":
                return this.lookUpNamespace( entityType, id );
            case "IRootNamespace":
                return (Ref<Element>) this.lookUpRootNamespace();
            default:
                throw new IllegalArgumentException( "Unrecognized entity type name: " + entityType.getName() );
        }

    }

    /**
     * Looks up the root namespace.
     *
     * @return the root namespace found or null if not found.
     */
    public Ref<IRootNamespace> lookUpRootNamespace() {

        // First try a look up in the associated registry.
        if ( this.rootNamespaceId != null ) {
            Ref<IRootNamespace> result = this.registry.lookUpElementByUuid( IRootNamespace.class, this.rootNamespaceId );

            if ( !result.isMissing() ) {
                return result;
            }
        }

        // Must be connected to a database for the look up.
        if ( !this.isConnected() ) {
            throw new IllegalStateException( "Not connected to a database." );
        }

        // Find the root namespace in the database.
        RootNamespaceDao dao = new RootNamespaceDao( this.database.get(), this.registry );
        IRootNamespace rootNamespace = dao.findRootNamespace();

        if ( rootNamespace == null ) {
            return Ref.missing();
        }

        // Register the result for future cached look up; find the one that matches our ID.
        this.rootNamespaceId = rootNamespace.getId();

        // Return the root namespace found.
        return rootNamespace.getSelf();

    }

    /**
     * Looks up a namespace.
     *
     * @param id the unique ID of the namespace to find.
     * @return the namespace found or Ref.missing if not found.
     */
    @SuppressWarnings("unchecked")
    private <Element extends IElement> Ref<Element> lookUpNamespace( Class<Element> elementType, UUID id ) {

        // First try a look up in the associated registry.
        return this.registry.lookUpElementByUuid( elementType, id ).orIfMissing( () -> {

            // Must be connected to a database for the look up.
            if ( !this.isConnected() ) {
                throw new IllegalStateException( "Not connected to a database." );
            }

            // If missing, find the namespace in the database.
            NamespaceDao dao = new NamespaceDao( this.database.get(), this.registry );
            IEntity namespace = dao.findNamespaceByUuid( id );

            if ( namespace == null ) {
                return Ref.missing();
            }

            return (Ref<Element>) namespace.getSelf();

        } );

    }

    private final ThreadLocal<Database> database;

    private final IElementRegistry registry;

    private UUID rootNamespaceId;

}
