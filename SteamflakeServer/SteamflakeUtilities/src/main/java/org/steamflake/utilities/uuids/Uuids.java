package org.steamflake.utilities.uuids;

import java.util.UUID;

/**
 * Static utility class for constructing UUIDs.
 */
public class Uuids {

    /**
     * Makes a UUID.
     * @return a new UUID as a string in the format /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/.
     */
    public static String makeUuid() {
        return UUID.randomUUID().toString();
    }

}
