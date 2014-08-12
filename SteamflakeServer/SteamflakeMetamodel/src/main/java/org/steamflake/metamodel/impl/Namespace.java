package org.steamflake.metamodel.impl;

import org.steamflake.metamodel.INamespace;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

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
        this.uuid = uuid;
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
    public String getUuid() {
        return this.uuid;
    }

    private final String name;

    private final String summary;

    private final String uuid;

}
