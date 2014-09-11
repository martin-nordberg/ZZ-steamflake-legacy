package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.Ref;

/**
 * Base class for named containers.
 */
public abstract class AbstractNamedContainerElement<ISelf extends INamedContainerElement, IParent extends INamedContainerElement>
    extends AbstractNamedElement<ISelf, IParent>
    implements INamedContainerElement<ISelf, IParent> {

    protected AbstractNamedContainerElement( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String name, String summary ) {
        super( self, parentContainer, name, summary );
    }

}
