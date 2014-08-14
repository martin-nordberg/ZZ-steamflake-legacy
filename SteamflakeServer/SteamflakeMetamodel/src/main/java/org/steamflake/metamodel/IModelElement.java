
package org.steamflake.metamodel;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.UUID;

/**
 * Interface to an abstract model element.
 */
public interface IModelElement {

    /**
     * @return the unique ID of this model element
     */
    @Nonnull
    UUID getId();

    /**
     * @return A short summary of this model element
     */
    @Nullable
    String getSummary();

}
