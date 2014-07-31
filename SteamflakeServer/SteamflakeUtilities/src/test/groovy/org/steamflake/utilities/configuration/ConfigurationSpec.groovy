package org.steamflake.utilities.configuration

import spock.lang.Specification

/**
 * Specification for org.steamflake.utilities.configuration.Configuration.
 */
class ConfigurationSpec extends Specification {

    def "Sample properties can be read" () {

        given:
        def config = new Configuration( ConfigurationSpec.class )

        when:
        def result = config.readString( key )

        then:
        result == expectedResult

        where:
        key    | expectedResult
        "key1" | "value1"
        "key2" | "value2"

    }

}
