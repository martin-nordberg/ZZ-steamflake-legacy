package org.steamflake.metamodel.actions.structure

import org.steamflake.metamodel.api.elements.IAction
import org.steamflake.metamodel.api.elements.Ref
import org.steamflake.metamodel.api.structure.entities.IRootNamespace
import org.steamflake.metamodel.impl.registry.NullElementRegistry
import org.steamflake.metamodel.impl.structure.entities.RootNamespace
import org.steamflake.utilities.revisions.StmTransaction
import org.steamflake.utilities.revisions.StmTransactionContext
import org.steamflake.utilities.uuids.Uuids
import spock.lang.Specification

/**
 * Specification for namespace creation actions.
 */
class CreateNamespaceActionSpec extends Specification {

    StmTransaction transaction

    def setup() {
        transaction = StmTransactionContext.beginTransaction();
    }

    def "The action creates a namespace"() {

        given: "a parent namespace"
        def registry = new NullElementRegistry();

        IRootNamespace root = new RootNamespace( Ref.byId( registry, Uuids.makeUuid(), IRootNamespace.class ), "Root namespace" );

        when: "the action is created"
        IAction action = new CreateNamespaceAction( Ref.byId( registry, Uuids.makeUuid(), CreateNamespaceAction.class ), root, Uuids.
                makeUuid(), "sub1", "sub namespace" );

        then: "the new namespace has given attributes"
        action.newNamespace.name == "sub1";
        action.newNamespace.summary == "sub namespace";

        and: "the new namespace is a child of the parent"
        // TODO

        and: "the action can be reversed"
        action.canReverse();
        IAction revAction = action.doMakeReversingAction( Uuids.makeUuid() );

        and: "the namespace is then destroyed"
        action.newNamespace.destroyed;
        // TODO: namespace is no longer a child

        and: "the destruction can be undone"
        revAction.makeReversingAction( Uuids.makeUuid() );
        !action.newNamespace.destroyed;
        // TODO: namespace is a child again

    }

    def cleanup() {
        StmTransactionContext.commitTransaction( transaction );
    }

}
