package org.steamflake.metamodel.elements;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.UUID;

/**
 * Top level base class for Steamflake model elements. Represents any model element with a summary and a unique ID.
 */
public interface IModelElement {

    /**
     * @return the unique ID of this model element
     */
    @Nonnull
    UUID getId();

    /**
     * @return a short summary of this model element
     */
    @Nullable
    String getSummary();

}
