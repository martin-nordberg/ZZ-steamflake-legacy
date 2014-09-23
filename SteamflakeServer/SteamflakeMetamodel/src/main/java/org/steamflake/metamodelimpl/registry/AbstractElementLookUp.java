package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.*;
import org.steamflake.metamodel.structure.entities.IAbstractNamespace;
import org.steamflake.metamodel.structure.entities.INamespace;
import org.steamflake.metamodel.structure.entities.IRootNamespace;

import java.util.HashMap;
import java.util.Map;

/**
 * Abstract base class for element look up implementations.
 */
public abstract class AbstractElementLookUp
    implements IElementLookUp {

    protected AbstractElementLookUp() {
        this.refSources = this.defineRefSources();
    }

    @SuppressWarnings("unchecked")
    @Override
    public <Element extends IElement> RefSource<Element> getRefSource( Class<Element> elementType ) {
        return (RefSource<Element>) this.refSources.get( elementType );
    }

    private Map<Class<? extends IElement>, RefSource<? extends IElement>> defineRefSources() {
        Map<Class<? extends IElement>, RefSource<? extends IElement>> result = new HashMap<>();

        result.put( IEntity.class, new RefSource<>( IEntity.class, this ) );
        result.put( INamedEntity.class, new RefSource<>( INamedEntity.class, this ) );
        result.put( IAbstractNamespace.class, new RefSource<>( IAbstractNamespace.class, this ) );
        result.put( INamespace.class, new RefSource<>( INamespace.class, this ) );
        result.put( IRootNamespace.class, new RefSource<>( IRootNamespace.class, this ) );

        return result;
    }

    private final Map<Class<? extends IElement>, RefSource<? extends IElement>> refSources;

}
