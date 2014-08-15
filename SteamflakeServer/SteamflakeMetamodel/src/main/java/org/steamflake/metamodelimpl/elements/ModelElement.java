package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.IModelElement;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.UUID;

/**
 * Top level base class for Steamflake model elements. Represents any model element with a summary and a unique ID.
 */
public abstract class ModelElement
    implements IModelElement {

    /**
     * Constructs a new model element.
     * @param id the unique ID of the model element
     * @param summary a short summary of the model element
     */
    protected ModelElement(
        UUID id,
        String summary
    ) {
        this.id = id;
        this.summary = summary;
    }

    @Nonnull
    @Override
    public final UUID getId() {
        return this.id;
    }

    @Nullable
    @Override
    public final String getSummary() {
        return this.summary;
    }

    private final UUID id;

    private final String summary;

}
