package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.IAbstractNamespace;
import org.steamflake.metamodelimpl.elements.NamedContainerElement;

import java.util.UUID;

/**
 * An abstract namespace is a naming structure distinguishing modules.
 */
public abstract class AbstractNamespace
    extends NamedContainerElement
    implements IAbstractNamespace {

    /**
     * Constructs a new abstract namespace.
     *
     * @param id      the unique ID of the namespace
     * @param name    the name of the namespace
     * @param summary a short summary of the namespace
     */
    protected AbstractNamespace( UUID id, String name, String summary ) {
        super( id, name, summary );
    }

}
