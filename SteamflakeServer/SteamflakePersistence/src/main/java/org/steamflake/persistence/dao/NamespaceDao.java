package org.steamflake.persistence.dao;

import fi.evident.dalesbred.Database;
import fi.evident.dalesbred.instantiation.Instantiator;
import fi.evident.dalesbred.instantiation.InstantiatorArguments;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;
import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodelimpl.structure.Namespace;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access object for namespaces.
 */
public class NamespaceDao {

    public NamespaceDao( Database database, IModelElementRegistry registry ) {

        this.database = database;
        this.registry = registry;

        final NamespaceInstantiator instantiator = new NamespaceInstantiator( registry );

        this.database.getInstantiatorRegistry().registerInstantiator( INamespace.class, instantiator );

    }

    public void createNamespace( INamespace namespace ) {
        this.database.withVoidTransaction( tx -> {
            this.database.update( "INSERT INTO MODEL_ELEMENT (ID, PARENT_CONTAINER_ID, SUMMARY, TYPE) VALUES (?, ?, ?, 'Namespace')", namespace.getId(), namespace.getParentContainerId(), namespace.getSummary() );
            this.database.update( "INSERT INTO CONTAINER_ELEMENT (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMED_ELEMENT (ID, NAME) VALUES (?, ?)", namespace.getId(), namespace.getName() );
            this.database.update( "INSERT INTO NAMED_CONTAINER_ELEMENT (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO ABSTRACT_NAMESPACE (ID) VALUES (?)", namespace.getId() );
            this.database.update( "INSERT INTO NAMESPACE (ID) VALUES (?)", namespace.getId() );
        } );
        this.registry.registerModelElement( namespace.getSelf() );
    }

    public void deleteNamespace( UUID namespaceId ) {
        this.registry.unregisterModelElement( namespaceId );
        this.database.update( "UPDATE MODEL_ELEMENT SET DESTROYED = TRUE WHERE ID = ?", namespaceId );
    }

    public INamespace findNamespaceByUuid( UUID namespaceId ) {

        Optional<Ref<INamespace>> result = this.registry.lookUpModelElementByUuid( INamespace.class, namespaceId );

        if ( !result.isPresent() ) {
            return this.database.findUniqueOrNull( INamespace.class, "SELECT TO_CHAR(ID), TO_CHAR(PARENT_CONTAINER_ID), NAME, SUMMARY FROM V_NAMESPACE WHERE ID = ?", namespaceId );
        }

        return result.get().get();
    }

    public List<? extends INamespace> findNamespacesAll() {
        return this.database.findAll( INamespace.class, "SELECT TO_CHAR(ID), TO_CHAR(PARENT_CONTAINER_ID), NAME, SUMMARY FROM V_NAMESPACE" );
    }

    private final Database database;

    /**
     * Custom instantiator for namespaces with model element registry look up.
     */
    private static class NamespaceInstantiator
        implements Instantiator<INamespace> {

        /**
         * Constructs a new instantiator associated with the given model element registry.
         * @param registry the registry of objects to use for caching and for unique object identity.
         */
        private NamespaceInstantiator( IModelElementRegistry registry ) {
            this.registry = registry;
        }

        /**
         * Instantiates a namespace either by finding it in the registry or else creating it and adding it to the registry.
         * @param fields the fields from the database query.
         * @return the new namespace.
         */
        @SuppressWarnings("NullableProblems")
        @Override
        public INamespace instantiate( InstantiatorArguments fields ) {

            final UUID id = UUID.fromString( (String) fields.getValues().get( 0 ) );

            Optional<Ref<INamespace>> result = registry.lookUpModelElementByUuid( INamespace.class, id );

            if ( result.isPresent() && result.get().isLoaded() ) {
                return result.get().get();
            }

            final UUID parentId = UUID.fromString( (String) fields.getValues().get( 1 ) );
            String name = (String) fields.getValues().get( 2 );
            String summary = (String) fields.getValues().get( 3 );

            Optional<Ref<IAbstractNamespace>> parent = registry.lookUpModelElementByUuid( IAbstractNamespace.class, parentId );

            if ( !parent.isPresent() ) {
                parent = Optional.of( Ref.byId( parentId ) );
                registry.registerModelElement( parent.get() );
            }

            Namespace namespace = new Namespace( id, parent.get(), name, summary );
            this.registry.registerModelElement( namespace.getSelf() );
            return namespace;

        }

        private final IModelElementRegistry registry;

    }

    private final IModelElementRegistry registry;

}
