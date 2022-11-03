//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Basic CBOR specification tools and constants.
 *
 */
library CBORSpec {

    // These bitmasks are used to parse out the major and shortCount values.
    uint8 constant internal MAJOR_BITMASK = uint8(0xe0); // 11100000
    uint8 constant internal SHORTCOUNT_BITMASK = ~MAJOR_BITMASK; // 00011111

    // Major Data Types
    enum MajorType {
        UnsignedInteger,
        NegativeInteger,
        ByteString,
        TextString,
        Array,
        Map,
        Semantic,
        Special
    }

    uint8 constant internal TAG_TYPE_BIGNUM = 2;
    uint8 constant internal TAG_TYPE_NEGATIVE_BIGNUM = 3;

    // Used to indicate the end of an extended count, indefinite array, or indefinite map
    bytes1 constant internal BREAK_MARKER = 0xff; // 111_11111

    // Values used to represent true and false
    uint8 constant internal UINT_TRUE = 1;
    uint8 constant internal UINT_FALSE = 0;

}
