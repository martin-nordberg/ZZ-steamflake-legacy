package org.steamflake.metamodel.impl.structure.entities;

import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.metamodel.api.structure.entities.IModule;
import org.steamflake.metamodel.api.structure.relationships.IModuleContainment;
import org.steamflake.metamodel.api.structure.relationships.IModuleDependency;
import org.steamflake.utilities.revisions.V;

import java.util.Set;

/**
 * Implementation for IModule.
 */
public final class Module
    extends AbstractPackage<IModule>
    implements IModule {

    /**
     * Constructs a new module with given attributes.
     *
     * @param self    the registered shared reference to the object.
     * @param name    the name of the module.
     * @param summary a summary of the module.
     * @param version the version number of the module.
     */
    public Module( Ref<IModule> self, String name, String summary, String version ) {
        super( self, name, summary );
        this.version = new V<>( version );
    }

    @Override
    public Set<? extends IModuleDependency> getDependedModuleRelationships() {
        return null;
    }

    @Override
    public Set<? extends IModuleDependency> getDependingModuleRelationships() {
        return null;
    }

    @Override
    public IModuleContainment getModuleContainmentRelationship() {
        return null;
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
