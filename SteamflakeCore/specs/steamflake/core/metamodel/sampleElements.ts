/**
 * Spec Helper Module: steamflake/core/metamodel/sampleElements
 */


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Element
    extends elements_impl.NamedElement {

    constructor(
        parentContainer: elements.IContainerElement,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentContainer, "Element", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Container
    extends elements_impl.NamedContainerElement {

    constructor(
        parentContainer: elements.IContainerElement,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentContainer, "Container", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class RootContainer
    extends elements_impl.NamedContainerElement
    implements elements.IRootContainerElement {

    constructor(
        parentContainer: elements.IContainerElement,
        uuid: string,
        name: string,
        summary: string
        ) {
        super( parentContainer, "RootContainer", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
