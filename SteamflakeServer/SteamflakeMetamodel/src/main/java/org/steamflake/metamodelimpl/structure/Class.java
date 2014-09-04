package org.steamflake.metamodelimpl.structure;

import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.structure.IClass;
import org.steamflake.metamodel.structure.IComponent;

import java.util.UUID;

/**
 * Implementation of IClass.
 */
public final class Class
    extends AbstractComponent<IClass, IComponent>
    implements IClass {

    /**
     * Constructs a new class with given attributes.
     *
     * @param id         the unique ID of the class.
     * @param parentId   the unique ID of the parent namespace of the class.
     * @param name       the name of the class.
     * @param summary    a summary of the class.
     * @param isExported whether this class is accessible outside its parent component.
     */
    public Class( String id, String parentId, String name, String summary, boolean isExported ) {
        super( UUID.fromString( id ), new Ref<>( UUID.fromString( parentId ) ), name, summary, isExported );
    }

    public Class( UUID id, IComponent parent, String name, String summary, boolean isExported ) {
        super( id, new Ref<>( parent.getId(), parent ), name, summary, isExported );
    }

}
