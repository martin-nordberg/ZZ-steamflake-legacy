package org.steamflake.persistence.registry;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.elements.IElementLookUp;
import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IElementRegistry;
import org.steamflake.metamodel.structure.entities.IRootNamespace;
import org.steamflake.metamodelimpl.registry.AbstractElementLookUp;
import org.steamflake.persistence.dao.NamespaceDao;
import org.steamflake.persistence.dao.RootNamespaceDao;

import java.util.UUID;

/**
 * Registry implementation that does database look ups for elements.
 */
public final class DatabaseElementRegistry
    extends AbstractElementLookUp
    implements IElementLookUp {

    /**
     * Constructs a new database-backed element look up facility.
     */
    public DatabaseElementRegistry( IElementRegistry registry, Database database ) {
        this.database = database;
        this.registry = registry;
        this.rootNamespaceId = null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public final <IElement extends IEntity> Ref<IElement> lookUpEntityByUuid( Class<IElement> entityType, UUID id ) {

        String typeName = entityType.getSimpleName();

        // TBD: will not be easy to make this work for abstract entity types

        switch ( typeName ) {
            case "INamespace":
                return this.lookUpNamespace( entityType, id );
            case "IRootNamespace":
                return (Ref<IElement>) this.lookUpRootNamespace();
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
            Ref<IRootNamespace> result = this.registry.lookUpEntityByUuid( IRootNamespace.class, this.rootNamespaceId );

            if ( !result.isMissing() ) {
                return result;
            }
        }

        // Find the root namespace in the database.
        RootNamespaceDao dao = new RootNamespaceDao( this.database, this.registry );
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
     * @return the namespace found or null if not found.
     */
    @SuppressWarnings("unchecked")
    private <IElement extends IEntity> Ref<IElement> lookUpNamespace( Class<IElement> entityType, UUID id ) {

        // First try a look up in the associated registry.
        return this.registry.lookUpEntityByUuid( entityType, id ).orIfMissing( () -> {

            // If missing, find the namespace in the database.
            NamespaceDao dao = new NamespaceDao( this.database, this.registry );
            IEntity namespace = dao.findNamespaceByUuid( id );

            if ( namespace == null ) {
                return Ref.missing();
            }

            return (Ref<IElement>) namespace.getSelf();

        } );

    }

    private final Database database;

    private final IElementRegistry registry;

    private UUID rootNamespaceId;

}
