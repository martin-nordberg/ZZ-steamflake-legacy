package org.steamflake.metamodel.structure.entities;

/**
 * A function represents an executable sequence of statements. For a module, it's the 'main' function of the module.
 * For a package it's the initializer of the package. For a component it's the constructor of the component. A method
 * is itself simply a single function.
 */
public interface IFunction<ISelf extends IFunction>
    extends IFunctionSignature<ISelf> {

}
