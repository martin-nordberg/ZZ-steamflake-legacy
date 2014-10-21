package org.steamflake.utilities.uuids

import spock.lang.Specification

/**
 * Specification for org.steamflake.utilities.uuids.Uuids
 */
class UuidsSpec extends Specification {

    def "Makes a single UUID in correct format"() {

        when: "a UUID is generated and converted to a string"
        def uuid = Uuids.makeUuid().toString()

        then: "it has the right version 1 UUID format"
        uuid.matches(/^[a-f0-9]{8}-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)

    }

    def "Makes a block-reserving UUID in correct format"() {

        when: "a UUID is generated with a reserved block"
        def uuid = Uuids.makeUuidWithReservedBlock().toString()

        then: "its fourth byte is zero"
        uuid.matches(/^[a-f0-9]{6}00-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)

    }

    def "Ensures that successive UUIDs are unique"() {

        when: "two UUIDs are generated"
        def uuid1 = Uuids.makeUuid().toString()
        def uuid2 = Uuids.makeUuid().toString()

        then: "they are unique"
        uuid1 != uuid2

    }

    def "Ensures that successive block-reserving UUIDs are unique"() {

        when: "two block-reserving UUIDs are generated"
        def uuid1 = Uuids.makeUuidWithReservedBlock().toString()
        def uuid2 = Uuids.makeUuidWithReservedBlock().toString()

        then: "both have fourth byte zero"
        uuid1.matches(/^[a-f0-9]{6}00-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
        uuid2.matches(/^[a-f0-9]{6}00-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)

        and: "they are unique"
        uuid1 != uuid2

    }

}
