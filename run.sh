#!/usr/bin/sh
deno run --allow-net --allow-read=./postalcodes.json --allow-write=./postalcodes.json update.ts
