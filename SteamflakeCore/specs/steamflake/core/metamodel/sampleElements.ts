/**
 * Spec Helper Module: steamflake/core/metamodel/sampleElements
 */


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISampleElement
    extends elements.INamedElement
{
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISampleContainer
    extends elements.IContainerElement
{

    makeSampleElement( uuid: string, attributes: any ) : ISampleElement;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISampleRootContainer
    extends elements.IRootContainerElement {

    makeSampleContainer( uuid : string, attributes : any ) : ISampleContainer;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class SampleElement
    extends elements_impl.NamedElement
    implements ISampleElement {

    constructor(
        parentContainer: ISampleContainer,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentContainer, "SampleElement", uuid, name, summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class SampleContainer
    extends elements_impl.NamedContainerElement
    implements ISampleContainer {

    constructor(
        parentContainer: ISampleRootContainer,
        uuid: string,
        name: string,
        summary: string
    ) {
        super( parentContainer, "SampleContainer", uuid, name, summary );
    }

    public makeSampleElement( uuid : string, attributes : any ) {
        return new SampleElement( this, uuid, attributes.name, attributes.summary );
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class SampleRootContainer
    extends elements_impl.NamedContainerElement
    implements elements.IRootContainerElement {

    constructor(
        uuid: string
    ) {
        super( this, "SampleRootContainer", uuid, "$", "(Top level sample root container)" );
    }

    public makeSampleContainer( uuid : string, attributes : any ) {
        return new SampleContainer( this, uuid, attributes.name, attributes.summary );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeSampleRootContainer( uuid : string ) : ISampleRootContainer {
    return new SampleRootContainer( uuid );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
