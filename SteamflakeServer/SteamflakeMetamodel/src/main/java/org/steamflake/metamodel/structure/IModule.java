package org.steamflake.metamodel.structure;

/**
 * A module is a deployable package.
 */
public interface IModule
    extends IAbstractPackage<IModule, INamespace> {

    /**
     * @return The version of this module.
     */
    String getVersion();

    /**
     * Changes the version of this module.
     *
     * @param version the new version.
     * @return this module.
     */
    IModule setVersion( String version );

}
