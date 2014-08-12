
package org.steamflake.metamodel;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Interface to an abstract model element.
 */
public interface IModelElement {

    /**
     * @return the UUID of this model element
     */
    @Nonnull
    String getUuid();

    /**
     * @return A short summary of this model element
     */
    @Nullable
    String getSummary();

}
