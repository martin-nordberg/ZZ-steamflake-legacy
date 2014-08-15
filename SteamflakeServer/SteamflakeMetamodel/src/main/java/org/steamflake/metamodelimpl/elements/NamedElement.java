package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedElement;

import javax.annotation.Nonnull;
import java.util.UUID;

/**
 * High level base class for Steamflake model elements that have names.
 */
public abstract class NamedElement
    extends ModelElement
    implements INamedElement {

    /**
     * Constructs a new named model element.
     *
     * @param id      the unique ID of the model element
     * @param name the name of the model element
     * @param summary a short summary of the model element
     */
    protected NamedElement( UUID id, String name, String summary ) {
        super( id, summary );
        this.name = name;
    }

    @Nonnull
    @Override
    public final String getName() {
        return this.name;
    }

    public final String name;

}
