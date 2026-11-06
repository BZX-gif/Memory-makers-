#!/usr/bin/env python3
"""Convert a WOFF1 font to a plain TTF using only the Python standard library.

ImageMagick's freetype backend cannot read WOFF, but WOFF1 is just a
zlib-compressed SFNT container, so unpacking it is trivial and lossless.
This lets scripts/generate-brand-assets.sh render share cards with the
storefront's real brand typefaces instead of a system substitute.

Usage: python3 scripts/woff_to_ttf.py <input.woff> <output.ttf>
"""
import struct
import sys
import zlib


def woff_to_ttf(data: bytes) -> bytes:
    if data[:4] != b"wOFF":
        raise SystemExit("Not a WOFF1 file (WOFF2 needs brotli).")
    (flavor, _length, num_tables, _reserved, _total, _maj, _min,
     _meta_off, _meta_len, _meta_orig, _priv_off, _priv_len) = struct.unpack(">IIHHIHHIIIII", data[4:44])

    entries = []
    offset = 44
    for _ in range(num_tables):
        tag, toff, comp_len, orig_len, checksum = struct.unpack(">4sIIII", data[offset:offset + 20])
        entries.append((tag, toff, comp_len, orig_len, checksum))
        offset += 20

    # SFNT header + table directory, then 4-byte aligned table bodies.
    header_size = 12 + 16 * num_tables
    body_offset = header_size
    search_range = 1
    while search_range * 2 <= num_tables:
        search_range *= 2
    search_range *= 16
    entry_selector = search_range // 16 - 1
    range_shift = 16 * num_tables - search_range

    directory = struct.pack(">IHHHH", flavor, num_tables, search_range, entry_selector, range_shift)
    bodies = b""
    for tag, toff, comp_len, orig_len, checksum in entries:
        raw = data[toff:toff + comp_len]
        table = zlib.decompress(raw) if comp_len < orig_len else raw
        table = table.ljust((len(table) + 3) & ~3, b"\0")
        directory += struct.pack(">4sIII", tag, checksum, body_offset, orig_len)
        bodies += table
        body_offset += len(table)

    return directory + bodies


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    source, target = sys.argv[1], sys.argv[2]
    with open(source, "rb") as handle:
        data = handle.read()
    with open(target, "wb") as handle:
        handle.write(woff_to_ttf(data))
    print(target)


if __name__ == "__main__":
    main()
