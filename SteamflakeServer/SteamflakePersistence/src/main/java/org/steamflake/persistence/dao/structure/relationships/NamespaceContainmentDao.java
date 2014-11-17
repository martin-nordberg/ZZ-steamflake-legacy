package org.steamflake.persistence.dao.structure.relationships;

import fi.evident.dalesbred.Database;
import fi.evident.dalesbred.instantiation.Instantiator;
import fi.evident.dalesbred.instantiation.InstantiatorArguments;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.registry.IElementRegistry;
import org.steamflake.metamodel.api.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.api.structure.entities.INamespace;
import org.steamflake.metamodel.api.structure.relationships.INamespaceContainment;
import org.steamflake.metamodel.impl.structure.relationships.NamespaceContainment;

import java.util.List;
import java.util.UUID;

/**
 * Data access object for namespaces.
 */
public class NamespaceContainmentDao {

    public NamespaceContainmentDao( Database database, IElementRegistry registry ) {

        this.database = database;
        this.registry = registry;

        final NamespaceContainmentInstantiator instantiator = new NamespaceContainmentInstantiator( registry );

        this.database.getInstantiatorRegistry().registerInstantiator( INamespaceContainment.class, instantiator );

    }

    public void createNamespaceContainment( INamespaceContainment namespaceContainment ) {

        this.database.withVoidTransaction( tx -> {
            this.database.update( "INSERT INTO RELATIONSHIP (ID, TYPE) VALUES (?, 'Namespace')", namespaceContainment.getId() );
            this.database.update( "INSERT INTO NAMESPACE_CONTAINMENT (ID, CONTAINING_NAMESPACE_ID, CONTAINED_NAMESPACE_ID) VALUES (?, ?, ?)",
                namespaceContainment.getId(), namespaceContainment.getContainingNamespace().getId(), namespaceContainment.getContainedNamespace().getId() );
        } );

        this.registry.registerElement( namespaceContainment.getSelf() );

    }

    public void deleteNamespaceContainment( UUID namespaceContainmentId ) {

        this.registry.unregisterElement( namespaceContainmentId );

        this.database.update( "UPDATE NAMESPACE_CONTAINMENT SET DESTROYED = TRUE WHERE ID = ?", namespaceContainmentId );

    }

    public List<? extends INamespaceContainment> findNamespaceContainmentsByContainedNamespace( UUID containedNamespaceId ) {

        return this.database.findAll( INamespaceContainment.class, "SELECT TO_CHAR(ID), TO_CHAR(CONTAINING_NAMESPACE_ID), TO_CHAR(CONTAINED_NAMESPACE_ID) FROM V_NAMESPACE_CONTAINMENT WHERE CONTAINED_NAMESPACE_ID = ?", containedNamespaceId );

    }

    public List<? extends INamespaceContainment> findNamespaceContainmentsByContainingNamespace( UUID containingNamespaceId ) {

        return this.database.findAll( INamespaceContainment.class, "SELECT TO_CHAR(ID), TO_CHAR(CONTAINING_NAMESPACE_ID), TO_CHAR(CONTAINED_NAMESPACE_ID) FROM V_NAMESPACE_CONTAINMENT WHERE CONTAINING_NAMESPACE_ID = ?", containingNamespaceId );

    }

    public INamespaceContainment findNamespaceContainmentByUuid( UUID namespaceContainmentId ) {

        return this.database.findUniqueOrNull( INamespaceContainment.class, "SELECT TO_CHAR(ID), TO_CHAR(CONTAINING_NAMESPACE_ID), TO_CHAR(CONTAINED_NAMESPACE_ID) FROM V_NAMESPACE_CONTAINMENT WHERE ID = ?", namespaceContainmentId );

    }

    /**
     * Custom instantiator for namespace containments with element registry look up.
     */
    private static class NamespaceContainmentInstantiator
        implements Instantiator<INamespaceContainment> {

        /**
         * Constructs a new instantiator associated with the given element registry.
         *
         * @param registry the registry of objects to use for caching and for unique object identity.
         */
        private NamespaceContainmentInstantiator( IElementRegistry registry ) {
            this.registry = registry;
        }

        /**
         * Instantiates a namespace containment either by finding it in the registry or else creating it and adding it to the registry.
         *
         * @param fields the fields from the database query.
         * @return the new namespace.
         */
        @SuppressWarnings("NullableProblems")
        @Override
        public INamespaceContainment instantiate( InstantiatorArguments fields ) {

            final UUID id = UUID.fromString( (String) fields.getValues().get( 0 ) );

            // First see if it's already loaded.
            Ref<INamespaceContainment> result = this.registry.lookUpElementByUuid( INamespaceContainment.class, id );
            if ( result.isLoaded() ) {
                return result.get();
            }

            // Get the attributes from the database result.
            final UUID containingNamespaceId = UUID.fromString( (String) fields.getValues().get( 1 ) );
            final UUID containedNamespaceId = UUID.fromString( (String) fields.getValues().get( 2 ) );

            Ref<IAbstractNamespace> containingNamespace = this.registry.lookUpElementByUuid( IAbstractNamespace.class, containingNamespaceId );
            Ref<INamespace> containedNamespace = this.registry.lookUpElementByUuid( INamespace.class, containedNamespaceId );

            // Create the namespace containment relationships.
            NamespaceContainment namespace = new NamespaceContainment( result.orById( id, INamespaceContainment.class ), containingNamespace, containedNamespace );

            // Register it for future look ups.
            this.registry.registerElement( namespace.getSelf() );

            return namespace;

        }

        private final IElementRegistry registry;

    }

    private final Database database;

    private final IElementRegistry registry;

}
