package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.Optional;
import java.util.UUID;

/**
 * Model element registry base class for building a chain of registries. The chain is constructed so that the
 * innermost registry is the first authority. This is so that outer registries can register model elements that
 * have been looked up. For example, an outer database-backed registry can cache values in an inner memory-backed
 * registry. Also, the inner registry could be much longer-loved than an outer one.
 */
public abstract class AbstractModelElementRegistryDecorator
    implements IModelElementRegistry {

    /**
     * Constructs a new model element registry.
     *
     * @param delegate the inner registry to delegate to when needed.
     */
    public AbstractModelElementRegistryDecorator( IModelElementRegistry delegate ) {
        this.delegate = delegate;
    }

    @Override
    public final <IElement extends IModelElement> Optional<Ref<IElement>> lookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {

        // Try the inner registry first.
        Optional<Ref<IElement>> result = this.delegate.lookUpModelElementByUuid( modelElementType, id );

        // If not found, do our own look up.
        if ( !result.isPresent() ) {
            result = this.doLookUpModelElementByUuid( modelElementType, id );
        }

        return result;

    }

    @Override
    public final boolean registerModelElement( Ref<? extends IModelElement> modelElement ) {

        // If cannot register with the inner registry, then register ourself.
        return this.delegate.registerModelElement( modelElement ) || this.doRegisterModelElement( modelElement );

    }

    @Override
    public final boolean unregisterModelElement( UUID modelElementId ) {

        // If cannot unregister with the inner registry, then unregister ourself.
        return this.delegate.unregisterModelElement( modelElementId ) || this.doUnregisterModelElement( modelElementId );

    }

    /**
     * Look up the model element of given type with given ID.
     *
     * @param modelElementType the type of element expected.
     * @param id               the unique ID of the element.
     * @param <IElement>       the type of the element.
     * @return the element found or Optional.empty() if not registered.
     */
    protected abstract <IElement extends IModelElement> Optional<Ref<IElement>> doLookUpModelElementByUuid( Class<IElement> modelElementType, UUID id );

    /**
     * Registers a model element.
     *
     * @param modelElement the model element to register.
     * @return whether the model element was registered.
     */
    protected abstract boolean doRegisterModelElement( Ref<? extends IModelElement> modelElement );

    /**
     * Unregisters a model element given its unique ID.
     *
     * @param modelElementId the unique ID of the element to unregister.
     * @return whether the model element was unregistered.
     */
    protected abstract boolean doUnregisterModelElement( UUID modelElementId );

    /**
     * @return the inner registry wrapped by this one.
     */
    protected final IModelElementRegistry getDelegate() {
        return this.delegate;
    }

    /**
     * An inner registry to delegate to when needed.
     */
    private final IModelElementRegistry delegate;

}
