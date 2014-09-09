package org.steamflake.persistence.registry;

import fi.evident.dalesbred.Database;
import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.metamodel.structure.IRootNamespace;
import org.steamflake.metamodelimpl.registry.AbstractModelElementRegistryDecorator;
import org.steamflake.metamodelimpl.registry.InMemoryModelElementRegistry;
import org.steamflake.persistence.dao.NamespaceDao;
import org.steamflake.persistence.dao.RootNamespaceDao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Model registry implementation that does database looks for model elements.
 */
public final class DatabaseModelElementRegistry
    extends AbstractModelElementRegistryDecorator {

    /**
     * Constructs a new model element registry.
     */
    public DatabaseModelElementRegistry( Database database ) {
        super( new InMemoryModelElementRegistry() );
        this.database = database;
        this.rootNamespaceId = null;
    }

    /**
     * Performs a database query for the root namespace. Caches the result for later look ups.
     * @return the root namespace.
     */
    public final Optional<Ref<IRootNamespace>> lookUpRootNamespace() {

        Optional<Ref<IRootNamespace>> result = Optional.empty();

        // First try a look up by the normal means.
        if ( this.rootNamespaceId != null ) {
            result = this.lookUpModelElementByUuid( IRootNamespace.class, this.rootNamespaceId );
        }

        // If not already registered, find in the database and then register for future look ups.
        if ( !result.isPresent() ) {
            result = Optional.of( this.findRootNamespace() );
        }

        return result;
    }

    @SuppressWarnings("unchecked")
    @Override
    protected final <IElement extends IModelElement> Optional<Ref<IElement>> doLookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {

        String typeName = modelElementType.getSimpleName();

        switch ( typeName ) {
            case "Namespace":
                return Optional.ofNullable( (Ref<IElement>) this.findNamespace( id ) );
            case "RootNamespace":
                return Optional.ofNullable( (Ref<IElement>) this.findRootNamespace() );
            default:
                throw new IllegalArgumentException( "Unrecognized model element type name: " + modelElementType.getName() );
        }

    }

    @Override
    protected final boolean doRegisterModelElement( Ref<? extends IModelElement> modelElement ) {
        return false;
    }

    @Override
    protected final boolean doUnregisterModelElement( UUID modelElementId ) {
        return false;
    }

    /**
     * Looks up a namespace. Also caches all other namespaces for future look ups.
     *
     * @param id the unique ID of the namespace to find.
     * @return the namespace found or null if not found.
     */
    private Ref<INamespace> findNamespace( UUID id ) {

        // Find all namespaces in the database.
        NamespaceDao dao = new NamespaceDao( this.database, this.getDelegate() );
        List<? extends INamespace> namespaces = dao.findNamespacesAll();

        // Register them all for future cached look up; find the one that matches our ID.
        INamespace result = null;
        for ( INamespace namespace : namespaces ) {
            if ( namespace.getId().equals( id ) ) {
                result = namespace;
            }
            this.registerModelElement( namespace.getSelf() );
        }

        if ( result == null ) {
            return null;
        }

        // Return the namespace found.
        return result.getSelf();

    }

    /**
     * Looks up a namespace. Also caches all other namespaces for future look ups.
     *
     * @return the namespace found or null if not found.
     */
    private Ref<IRootNamespace> findRootNamespace() {

        // Find the root namespace in the database.
        RootNamespaceDao dao = new RootNamespaceDao( this.database );
        IRootNamespace result = dao.findRootNamespace();

        if ( result == null ) {
            return null;
        }

        // Register the result for future cached look up; find the one that matches our ID.
        this.rootNamespaceId = result.getId();
        this.registerModelElement( result.getSelf() );

        // Return the namespace found.
        return result.getSelf();

    }

    private final Database database;

    private UUID rootNamespaceId;

}
