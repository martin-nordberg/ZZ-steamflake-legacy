package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import fi.evident.dalesbred.instantiation.Instantiator;
import fi.evident.dalesbred.instantiation.InstantiatorArguments;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;
import org.steamflake.metamodel.api.structure.entities.INamespace;
import org.steamflake.metamodel.impl.structure.entities.Namespace;

import java.util.List;
import java.util.UUID;

/**
 * Data access object for namespaces.
 */
public class NamespaceDao {

    public NamespaceDao( Database database, IElementRegistry registry ) {

        this.database = database;
        this.registry = registry;

        final NamespaceInstantiator instantiator = new NamespaceInstantiator( registry );

        this.database.getInstantiatorRegistry().registerInstantiator( INamespace.class, instantiator );

    }

    public void createNamespace( INamespace namespace ) {

        this.database.withVoidTransaction( tx -> {
            this.database.update( "INSERT INTO ENTITY (ID, TYPE) VALUES (?, 'Namespace')", namespace.getId() );
            this.database.update( "INSERT INTO NAMED_ENTITY (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO ABSTRACT_NAMESPACE (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMESPACE (ID, NAME, SUMMARY) VALUES (?, ?, ?)", namespace.getId(), namespace.getName(), namespace.getSummary() );
        } );

        this.registry.registerElement( namespace.getSelf() );

    }

    public void deleteNamespace( UUID namespaceId ) {

        this.registry.unregisterElement( namespaceId );

        this.database.update( "UPDATE NAMESPACE SET DESTROYED = TRUE WHERE ID = ?", namespaceId );

    }

    public INamespace findNamespaceByUuid( UUID namespaceId ) {

        return this.database.findUniqueOrNull( INamespace.class, "SELECT TO_CHAR(ID), NAME, SUMMARY FROM V_NAMESPACE WHERE ID = ?", namespaceId );

    }

    public List<? extends INamespace> findNamespacesAll() {

        return this.database.findAll( INamespace.class, "SELECT TO_CHAR(ID), NAME, SUMMARY FROM V_NAMESPACE" );

    }

    /**
     * Custom instantiator for namespaces with element registry look up.
     */
    private static class NamespaceInstantiator
        implements Instantiator<INamespace> {

        /**
         * Constructs a new instantiator associated with the given element registry.
         *
         * @param registry the registry of objects to use for caching and for unique object identity.
         */
        private NamespaceInstantiator( IElementRegistry registry ) {
            this.registry = registry;
        }

        /**
         * Instantiates a namespace either by finding it in the registry or else creating it and adding it to the registry.
         *
         * @param fields the fields from the database query.
         * @return the new namespace.
         */
        @SuppressWarnings("NullableProblems")
        @Override
        public INamespace instantiate( InstantiatorArguments fields ) {

            final UUID id = UUID.fromString( (String) fields.getValues().get( 0 ) );

            // First see if it's already loaded.
            Ref<INamespace> result = this.registry.lookUpElementByUuid( INamespace.class, id );
            if ( result.isLoaded() ) {
                return result.get( INamespace.class );
            }

            // Get the attributes from the database result.
            final String name = (String) fields.getValues().get( 1 );
            final String summary = (String) fields.getValues().get( 2 );

            // Create the namespace.
            Namespace namespace = new Namespace( result.orById( id ), name, summary );

            // Register it for future look ups.
            this.registry.registerElement( namespace.getSelf() );

            return namespace;

        }

        private final IElementRegistry registry;

    }

    private final Database database;

    private final IElementRegistry registry;

}
