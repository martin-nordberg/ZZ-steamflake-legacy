package org.steamflake.metamodel.structure;

/**
 * A module is a deployable package.
 */
public interface IModule
    extends IAbstractPackage {

    /**
     * @return The version of this module.
     */
    String getVersion();

}
