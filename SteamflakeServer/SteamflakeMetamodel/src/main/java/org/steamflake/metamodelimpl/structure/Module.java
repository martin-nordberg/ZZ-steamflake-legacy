package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IModule;
import org.steamflake.metamodel.structure.INamespace;
import org.steamflake.utilities.revisions.V;

/**
 * Implementation for IModule.
 */
public final class Module
    extends AbstractPackage<IModule, INamespace>
    implements IModule {

    /**
     * Constructs a new module with given attributes.
     *
     * @param self    the registered shared reference to the object.
     * @param parent  the parent namespace of the module.
     * @param name    the name of the module.
     * @param summary a summary of the module.
     * @param version the version number of the module.
     */
    public Module( Ref<IModule> self, Ref<? extends INamespace> parent, String name, String summary, String version ) {
        super( self, parent, name, summary, true );
        this.version = new V<>( version );
    }

    @Override
    public INamespace getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( INamespace.class, registry );
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
