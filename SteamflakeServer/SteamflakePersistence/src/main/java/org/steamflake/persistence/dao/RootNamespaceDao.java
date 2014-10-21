package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import fi.evident.dalesbred.instantiation.Instantiator;
import fi.evident.dalesbred.instantiation.InstantiatorArguments;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;
import org.steamflake.metamodel.api.structure.entities.IRootNamespace;
import org.steamflake.metamodel.impl.structure.entities.RootNamespace;

import java.util.UUID;

/**
 * Data access for the root namespace.
 */
public class RootNamespaceDao {

    public RootNamespaceDao( Database database, IElementRegistry registry ) {

        this.database = database;

        final RootNamespaceInstantiator instantiator = new RootNamespaceInstantiator( registry );

        this.database.getInstantiatorRegistry().registerInstantiator( IRootNamespace.class, instantiator );

    }

    /**
     * Finds the one and only root namespace. (Creates it for the first time if not found.)
     *
     * @return the root namespace.
     */
    public IRootNamespace findRootNamespace() {

        return this.database.findUniqueOrNull( IRootNamespace.class, "SELECT TO_CHAR(ID), SUMMARY FROM ROOT_NAMESPACE" );

    }

    /**
     * Custom instantiator for root namespaces with element registry look up.
     */
    private static class RootNamespaceInstantiator
        implements Instantiator<IRootNamespace> {

        /**
         * Constructs a new instantiator associated with the given element registry.
         *
         * @param registry the registry of objects to use for caching and for unique object identity.
         */
        private RootNamespaceInstantiator( IElementRegistry registry ) {
            this.registry = registry;
        }

        /**
         * Instantiates a root namespace either by finding it in the registry or else creating it and adding it to the registry.
         *
         * @param fields the fields from the database query.
         * @return the new namespace.
         */
        @SuppressWarnings("NullableProblems")
        @Override
        public IRootNamespace instantiate( InstantiatorArguments fields ) {

            final UUID id = UUID.fromString( (String) fields.getValues().get( 0 ) );

            // First see if it's already loaded.
            Ref<IRootNamespace> result = this.registry.lookUpElementByUuid( IRootNamespace.class, id );
            if ( result.isLoaded() ) {
                return result.get( IRootNamespace.class );
            }

            // Get the attributes from the database result.
            final String summary = (String) fields.getValues().get( 1 );

            // Create the root namespace.
            RootNamespace rootNamespace = new RootNamespace( result.orById( id ), summary );

            // Register it for future look ups.
            this.registry.registerElement( rootNamespace.getSelf() );

            return rootNamespace;

        }

        private final IElementRegistry registry;

    }

    private final Database database;

}
