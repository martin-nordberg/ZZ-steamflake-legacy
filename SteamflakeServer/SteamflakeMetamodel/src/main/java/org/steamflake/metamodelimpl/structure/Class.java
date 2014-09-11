package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.IModelElementLookUp;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IComponent;

/**
 * Implementation of IClass.
 */
public final class Class
    extends AbstractComponent<IClass, IComponent>
    implements IClass {

    /**
     * Constructs a new class with given attributes.
     *
     * @param self       the registered shared reference to the object.
     * @param parent     the parent component of the class.
     * @param name       the name of the class.
     * @param summary    a summary of the class.
     * @param isExported whether this class is accessible outside its parent component.
     */
    public Class( Ref<IClass> self, Ref<? extends IComponent> parent, String name, String summary, boolean isExported ) {
        super( self, parent, name, summary, isExported );
    }

    @Override
    public IComponent getParentContainer( IModelElementLookUp registry ) {
        return this.parentContainer.get().orLookUp( IComponent.class, registry );
    }

}
