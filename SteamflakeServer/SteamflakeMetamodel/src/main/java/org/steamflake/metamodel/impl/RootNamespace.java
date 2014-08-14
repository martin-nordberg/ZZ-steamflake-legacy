package org.steamflake.metamodel.impl;

import org.steamflake.metamodel.INamespace;
import org.steamflake.metamodel.IRootNamespace;
import org.steamflake.utilities.uuids.Uuids;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.UUID;

/**
 * Root namespace implementation.
 */
public class RootNamespace
    implements IRootNamespace {

    /**
     * Constructs a new namespace.
     * @param uuid the unique ID of the namespace.
     * @param summary a short summary of the namespace.
     */
    public RootNamespace(
        String uuid,
        String summary
    ) {
        this.uuid = UUID.fromString( uuid );
        this.summary = summary;
    }

    @Nonnull
    @Override
    public String getName() {
        return "$";
    }

    @Nullable
    @Override
    public String getSummary() {
        return this.summary;
    }

    @Nonnull
    @Override
    public UUID getId() {
        return this.uuid;
    }

    private final String summary;

    private final UUID uuid;

}
