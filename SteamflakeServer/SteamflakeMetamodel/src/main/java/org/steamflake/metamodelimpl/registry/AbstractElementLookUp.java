package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IElementLookUp;
import org.steamflake.metamodel.elements.IEntity;
import org.steamflake.metamodel.elements.INamedEntity;
import org.steamflake.metamodel.elements.RefSource;
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
    public <IElement extends IEntity> RefSource<IElement> getRefSource( Class<IElement> entityType ) {
        return (RefSource<IElement>) this.refSources.get( entityType );
    }

    private Map<Class<? extends IEntity>, RefSource<? extends IEntity>> defineRefSources() {
        Map<Class<? extends IEntity>, RefSource<? extends IEntity>> result = new HashMap<>();

        result.put( IEntity.class, new RefSource<>( IEntity.class, this ) );
        result.put( INamedEntity.class, new RefSource<>( INamedEntity.class, this ) );
        result.put( IAbstractNamespace.class, new RefSource<>( IAbstractNamespace.class, this ) );
        result.put( INamespace.class, new RefSource<>( INamespace.class, this ) );
        result.put( IRootNamespace.class, new RefSource<>( IRootNamespace.class, this ) );

        return result;
    }

    private final Map<Class<? extends IEntity>, RefSource<? extends IEntity>> refSources;

}
