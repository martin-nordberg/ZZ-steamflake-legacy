package org.steamflake.metamodel.impl;

import org.steamflake.metamodel.INamespace;
import org.steamflake.utilities.uuids.Uuids;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.UUID;

/**
 * Namespace implementation.
 */
public class Namespace
    implements INamespace {

    /**
     * Constructs a new namespace.
     * @param uuid the unique ID of the namespace.
     * @param name the name of the namespace.
     * @param summary a short summary of the namespace.
     */
    public Namespace(
        String uuid,
        String name,
        String summary
    ) {
        this.uuid = UUID.fromString( uuid );
        this.name = name;
        this.summary = summary;
    }

    @Nonnull
    @Override
    public String getName() {
        return this.name;
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

    private final String name;

    private final String summary;

    private final UUID uuid;

}
