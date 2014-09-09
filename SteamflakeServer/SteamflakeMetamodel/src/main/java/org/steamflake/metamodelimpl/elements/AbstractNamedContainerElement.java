package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;

import java.util.UUID;

/**
 * Base class for named containers.
 */
public abstract class AbstractNamedContainerElement<ISelf extends INamedContainerElement, IParent extends INamedContainerElement>
    extends AbstractNamedElement<ISelf, IParent>
    implements INamedContainerElement<ISelf, IParent> {

    protected AbstractNamedContainerElement( UUID id, Ref<? extends IParent> parentContainer, String name, String summary ) {
        super( id, parentContainer, name, summary );
    }

}
