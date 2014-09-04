package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IModule;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.utilities.revisions.V;

import java.util.UUID;

/**
 * Implementation for IModule.
 */
public final class Module
    extends AbstractPackage<IModule, INamespace>
    implements IModule {

    /**
     * Constructs a new module with given attributes.
     *
     * @param id       the unique ID of the module.
     * @param parentId the unique ID of the parent namespace of the module.
     * @param name     the name of the module.
     * @param summary  a summary of the module.
     * @param version  the version number of the module.
     */
    public Module( String id, String parentId, String name, String summary, String version ) {
        super( UUID.fromString( id ), new Ref<>( UUID.fromString( parentId ) ), name, summary, true );
        this.version = new V<>( version );
    }

    public Module( UUID id, INamespace parent, String name, String summary, String version ) {
        super( id, new Ref<>( parent.getId(), parent ), name, summary, true );
        this.version = new V<>( version );
    }

    @Override
    public String getVersion() {
        return this.version.get();
    }

    @Override
    public IModule setVersion( String version ) {
        this.version.set( version );
        return this;
    }

    /**
     * The version number of this module.
     */
    private final V<String> version;

}
