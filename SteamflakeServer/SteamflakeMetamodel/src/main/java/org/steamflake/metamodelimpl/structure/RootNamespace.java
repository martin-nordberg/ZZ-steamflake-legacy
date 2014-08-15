package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.structure.IRootNamespace;

import java.util.UUID;

/**
 * Root namespace implementation.
 */
public class RootNamespace
    extends AbstractNamespace
    implements IRootNamespace {

    /**
     * Constructs a new namespace.
     * @param id the unique ID of the namespace.
     * @param summary a short summary of the namespace.
     */
    public RootNamespace(
        String id,
        String summary
    ) {
        super( UUID.fromString( id ), "$", summary );
    }

}
