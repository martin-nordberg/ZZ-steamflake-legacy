package org.steamflake.metamodelimpl.registry;

import org.steamflake.metamodel.elements.IModelElement;
import org.steamflake.metamodel.elements.Ref;
import org.steamflake.metamodel.registry.IModelElementRegistry;

import java.util.Objects;
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
    public final <IElement extends IModelElement> Ref<IElement> lookUpModelElementByUuid( Class<IElement> modelElementType, UUID id ) {

        // Try the inner registry first.
        Ref<IElement> result = this.delegate.lookUpModelElementByUuid( modelElementType, id );

        // If not found, do our own look up.
        if ( result.isMissing() ) {
            result = this.doLookUpModelElementByUuid( modelElementType, id );
        }

        return result;

    }

    @Override
    public final void registerModelElement( Ref<? extends IModelElement> modelElement ) {

        modelElement.ifMissingThrow( NullPointerException::new );

        this.delegate.registerModelElement( modelElement );

        this.doRegisterModelElement( modelElement );

    }

    @Override
    public final void unregisterModelElement( UUID modelElementId ) {

        Objects.requireNonNull( modelElementId );

        this.doUnregisterModelElement( modelElementId );

        this.delegate.unregisterModelElement( modelElementId );

    }

    /**
     * Look up the model element of given type with given ID.
     *
     * @param modelElementType the type of element expected.
     * @param id               the unique ID of the element.
     * @param <IElement>       the type of the element.
     * @return the element found or Ref.missing() if not registered.
     */
    protected abstract <IElement extends IModelElement> Ref<IElement> doLookUpModelElementByUuid( Class<IElement> modelElementType, UUID id );

    /**
     * Registers a model element.
     *
     * @param modelElement the model element to register.
     */
    protected abstract void doRegisterModelElement( Ref<? extends IModelElement> modelElement );

    /**
     * Unregisters a model element given its unique ID.
     *
     * @param modelElementId the unique ID of the element to unregister.
     */
    protected abstract void doUnregisterModelElement( UUID modelElementId );

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
