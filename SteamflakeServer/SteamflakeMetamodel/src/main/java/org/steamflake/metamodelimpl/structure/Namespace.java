package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.INamespace;

import java.util.UUID;

/**
 * Namespace implementation.
 */
public class Namespace
    extends AbstractNamespace
    implements INamespace {

    /**
     * Constructs a new namespace.
     * @param id the unique ID of the namespace.
     * @param name the name of the namespace.
     * @param summary a short summary of the namespace.
     */
    public Namespace(
        String id,
        String name,
        String summary
    ) {
        super( UUID.fromString( id ), name, summary );
    }

}
