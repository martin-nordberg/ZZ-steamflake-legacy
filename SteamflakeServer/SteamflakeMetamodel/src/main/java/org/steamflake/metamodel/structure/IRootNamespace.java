package org.steamflake.metamodel.structure;

import org.steamflake.metamodel.elements.IRootContainerElement;

/**
 * A root namespace represents the nameless top level namespace.
 */
public interface IRootNamespace
    extends IRootContainerElement, IAbstractNamespace<IRootNamespace, IRootNamespace> {

}
