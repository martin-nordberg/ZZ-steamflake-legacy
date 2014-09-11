package org.steamflake.metamodelimpl.elements;

import org.steamflake.metamodel.elements.INamedContainerElement;
import org.steamflake.metamodel.elements.INamedElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.utilities.revisions.V;

/**
 * Abstract base class for named model elements
 */
public abstract class AbstractNamedElement<ISelf extends INamedElement, IParent extends INamedContainerElement>
    extends AbstractModelElement<ISelf, IParent>
    implements INamedElement<ISelf, IParent> {

    protected AbstractNamedElement( Ref<ISelf> self, Ref<? extends IParent> parentContainer, String name, String summary ) {
        super( self, parentContainer, summary );
        this.name = new V<>( name );
    }

    @Override
    public final String getName() {
        return this.name.get();
    }

    @SuppressWarnings("unchecked")
    @Override
    public final ISelf setName( String name ) {
        this.name.set( name );
        return (ISelf) this;
    }

    /**
     * The name of this model element.
     */
    private final V<String> name;

}
