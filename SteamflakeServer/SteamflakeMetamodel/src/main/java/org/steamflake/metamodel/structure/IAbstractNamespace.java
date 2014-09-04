package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.INamedContainerElement;

import java.util.UUID;

/**
 * An abstract namespace is a naming structure distinguishing modules.
 */
public interface IAbstractNamespace<ISelf extends IAbstractNamespace, IParent extends IAbstractNamespace>
    extends INamedContainerElement<ISelf, IParent> {

    /**
     * Creates a new namespace that is a child of this one.
     *
     * @param id      the unique ID for the new namespace.
     * @param name    the name of the new namespace.
     * @param summary the short summary of the new namespace.
     * @return the namespace created.
     */
    INamespace makeNamespace( UUID id, String name, String summary );

}
