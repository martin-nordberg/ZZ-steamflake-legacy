package org.steamflake.persistence.registry;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.persistence.dao.NamespaceDao;
import org.steamflake.persistence.dao.RootNamespaceDao;

import java.util.UUID;

/**
 * Model registry implementation that does database looks for model elements.
 */
public final class DatabaseModelElementRegistry
    implements IModelElementLookUp {

    /**
     * Constructs a new model element registry.
     */
    public DatabaseModelElementRegistry( IModelElementRegistry registry, Database database ) {
        this.database = database;
        this.registry = registry;
        this.rootNamespaceId = null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public final <IElement extends IModelElement> Ref<IElement> lookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {

        String typeName = modelElementType.getSimpleName();

        switch ( typeName ) {
            case "INamespace":
                return (Ref<IElement>) this.lookUpNamespace( id );
            case "IRootNamespace":
                return (Ref<IElement>) this.lookUpRootNamespace();
            default:
                throw new IllegalArgumentException( "Unrecognized model element type name: " + modelElementType.getName() );
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
            Ref<IRootNamespace> result = this.registry.lookUpModelElementByUuid( IRootNamespace.class, this.rootNamespaceId );

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
    private Ref<INamespace> lookUpNamespace( UUID id ) {

        // First try a look up in the associated registry.
        return this.registry.lookUpModelElementByUuid( INamespace.class, id ).orIfMissing( () -> {

            // If missing, find the namespace in the database.
            NamespaceDao dao = new NamespaceDao( this.database, this.registry );
            INamespace namespace = dao.findNamespaceByUuid( id );

            if ( namespace == null ) {
                return Ref.missing();
            }

            return namespace.getSelf();

        } );

    }

    private final Database database;

    private final IModelElementRegistry registry;

    private UUID rootNamespaceId;

}
