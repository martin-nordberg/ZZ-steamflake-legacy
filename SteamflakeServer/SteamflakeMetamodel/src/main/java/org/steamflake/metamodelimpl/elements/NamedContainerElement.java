package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedContainerElement;

import java.util.UUID;

/**
 * High level base class for named model elements that contain other elements.
 */
public abstract class NamedContainerElement
    extends NamedElement
    implements INamedContainerElement {

    /**
     * Constructs a new named container element.
     *
     * @param id      the unique ID of the model element
     * @param name    the name of the model element
     * @param summary a short summary of the model element
     */
    protected NamedContainerElement( UUID id, String name, String summary ) {
        super( id, name, summary );
    }

}



