package org.steamflake.utilities.uuids;

import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Static utility class for generating UUIDs. Generates Version 1 JDK UUIDs. Hopefully more useful for
 * database keys than the random UUIDs produced by the JDK.
 */
public class Uuids {

    /**
     * Makes a version 1 UUID.
     *
     * @return a new UUID as a string in the format /^[a-f0-9]{8}-[a-f0-9]{4}-1[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/.
     */
    public static UUID makeUuid() {
        return new UUID( getNextTimeAndVersion( false ), CLOCK_SEQ_AND_NODE );
    }

    /**
     * Makes a UUID with a block of 256 sequential UUIDs reserved. The next UUID returned by this generator
     * will be different in its first three bytes, so a remote client can safely create up to 256 UUIDs from the
     * given one by incrementing only the fourth byte. The fourth byte will be 0x00.
     *
     * @return a new UUID as a string in the format /^[a-f0-9]{6}00-[a-f0-9]{4}-1[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/.
     */
    public static UUID makeUuidWithReservedBlock() {
        return new UUID( getNextTimeAndVersion( true ), CLOCK_SEQ_AND_NODE );
    }

    /**
     * Computes a clock sequence and node value.
     *
     * @return the low-order 64 bits of the UUID
     */
    private static long determineClockSeqAndNode() {

        // node
        byte[] macAddress = determineMacAddress();
        long result = macAddress[5];
        result |= (0xFFL & macAddress[4]) << 8;
        result |= (0xFFL & macAddress[3]) << 16;
        result |= (0xFFL & macAddress[2]) << 24;
        result |= (0xFFL & macAddress[1]) << 32;
        result |= (0xFFL & macAddress[0]) << 40;

        // clock sequence - TBD: currently random; store & retrieve a value instead
        result |= (long) (Math.random() * 0x3FFF) << 48;

        // reserved bits
        result |= 0x8000000000000000L;

        return result;

    }

    /**
     * Determines the MAC address of the host.
     *
     * @return six bytes of the MAC address
     */
    private static byte[] determineMacAddress() {

        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
            if ( networkInterfaces != null ) {
                while ( networkInterfaces.hasMoreElements() ) {
                    NetworkInterface networkInterface = networkInterfaces.nextElement();

                    byte[] result = networkInterface.getHardwareAddress();

                    if ( result != null && result.length == 6 && result[1] != (byte) 0xff ) {
                        return result;
                    }
                }
            }
        } catch ( SocketException ex ) {
            // ignore
        }

        return null;

    }

    /**
     * Computes the next time field from the current system time plus any counter increment needed.
     *
     * @param reservedTimeBlock If true, ensure that the next time returned after this one will be 256 * 100ns later
     * @return the high 64 bits of the next UUID (version 1)
     */
    private static long getNextTimeAndVersion( boolean reservedTimeBlock ) {

        // retrieve system time (UTC)
        long timeMs = System.currentTimeMillis();

        // convert to 100ns units
        long time100ns = timeMs * 10000;

        // convert to UUID time (from Gregorian start)
        time100ns += 0x01B21DD213814000L;

        // get the next time value to use, ensuring uniqueness and reserving 256 values when required
        while ( true ) {
            // for blocks of UUIDs use 00 as last byte after rounding up
            if ( reservedTimeBlock ) {
                time100ns += 0xFF;
                time100ns &= 0xFFFFFFFFFFFFFF00L;
            }

            long last = prevTime100ns.get();

            if ( time100ns > last ) {
                if ( reservedTimeBlock ) {
                    if ( prevTime100ns.compareAndSet( last, time100ns + 0xFF ) ) {
                        break;
                    }
                } else if ( prevTime100ns.compareAndSet( last, time100ns ) ) {
                    break;
                }
            } else {
                time100ns = last + 1;
            }
        }

        // time low
        long result = time100ns << 32;

        // time mid
        result |= (time100ns & 0xFFFF00000000L) >> 16;

        // time hi and version 1
        result |= (time100ns >> 48) & 0x0FFF;

        // version 1
        result |= 0x1000;

        return result;

    }

    /**
     * The clock sequence and node value.
     */
    private static final long CLOCK_SEQ_AND_NODE = determineClockSeqAndNode();

    /**
     * The last used time value. Tracks time but with atomic increments when needed to avoid duplicates.
     */
    private static AtomicLong prevTime100ns = new AtomicLong( Long.MIN_VALUE );

}
