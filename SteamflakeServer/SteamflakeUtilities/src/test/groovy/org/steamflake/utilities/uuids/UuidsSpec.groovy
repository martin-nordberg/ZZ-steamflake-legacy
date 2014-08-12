package org.steamflake.utilities.uuids

import spock.lang.Specification

/**
 * Specification for org.steamflake.utilities.uuids.Uuids
 */
class UuidsSpec extends Specification {

    def "Makes a UUID in correct format" () {

        when:
        def uuid = Uuids.makeUuid()

        then:
        uuid.matches( /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/ )

    }

}
