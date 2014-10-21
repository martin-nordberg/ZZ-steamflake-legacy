package org.steamflake.metamodel.impl.elements.entities;

import org.steamflake.metamodel.api.elements.INamedEntity;
import org.steamflake.metamodel.api.elements.Ref;
import org.steamflake.utilities.revisions.V;

/**
 * Abstract base class for named entities.
 */
public abstract class AbstractNamedEntity<ISelf extends INamedEntity>
    extends AbstractEntity<ISelf>
    implements INamedEntity<ISelf> {

    protected AbstractNamedEntity( Class<ISelf> selfType, Ref<ISelf> self, String name, String summary ) {
        super( selfType, self, summary );
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
     * The name of this entity.
     */
    private final V<String> name;

}
