package org.steamflake.metamodel.structure;

import java.util.UUID;

/**
 * A namespace is a naming structure distinguishing modules. Namespaces are packages bigger than a module, smaller
 * than the root namespace.
 */
public interface INamespace
    extends IAbstractNamespace<INamespace> {

    /**
     * Creates a new module.
     *
     * @param id      the unique ID for the new namespace.
     * @param name    the name of the new namespace.
     * @param summary the short summary of the new namespace.
     * @param version the version of the module.
     * @return the namespace created.
     */
    IModule makeModule( UUID id, String name, String summary, String version );

}
