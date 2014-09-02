package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedContainerElement;

import java.util.UUID;

/**
 * Base class for named containers.
 */
public abstract class AbstractNamedContainerElement<ISelf, IParent extends INamedContainerElement>
    extends AbstractNamedElement<ISelf, IParent>
    implements INamedContainerElement<ISelf, IParent> {

    protected AbstractNamedContainerElement( UUID id ) {
        super( id );
    }

}
