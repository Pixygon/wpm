# wpm — the Weft package registry

Like npm, with the one difference that changes everything: **packages cannot
lie.** Weft definitions are named by the hash of their canonical bytes, so
wpm is a well-lit shelf, never an authority — every upload is verified
before storage, every consumer re-verifies locally, mirrors are equals, and
nothing published can be changed or broken retroactively.

Spec: [weft-pack-v0.1](https://github.com/Pixygon/Infinite/blob/main/docs/spec/weft-pack-v0.1.md)
· CLI: `weftpack` (crates/weft-pack in the Infinite repo)
· In-world directory: `thread://weft.pixygon.io` (the Weavery)

## API

| Route | What |
|---|---|
| `GET /` | index of all packages (name, exports, url) |
| `GET /packages/<name>.weftpack.json` | the package |
| `GET /.well-known/weft/<name>.weftpack.json` | same, Thread convention |
| `POST /publish` | body = package JSON; **verified before storage**; `Authorization: Bearer $WPM_TOKEN` if the gate is set |
| `GET /healthz` | liveness |

## Publish

```bash
weftpack publish my-lib.weftpack.json --registry https://wpm.pixygon.io
# or raw:
curl -X POST -H "authorization: Bearer $WPM_TOKEN" \
  --data-binary @my-lib.weftpack.json https://wpm.pixygon.io/publish
```

The server refuses anything the Weft verifier refuses (hash mismatches,
dangling exports, type/effect/fuel violations). Names are petnames; the
same name republished is a *pointer moving* — every consumer still verifies
the bytes they actually fetched.

## Run

`PORT` (3000) · `WPM_DATA` (./data, mount a volume) · `WPM_TOKEN`
(optional publish gate — set it in production). Boot seeds `seed/*.weftpack.json`
into an empty shelf: weft-form, weft-motion, weft-clock.
