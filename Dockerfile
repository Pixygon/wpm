# wpm — the Weft package registry. Rust build → slim runtime.
FROM rust:1.85-slim AS build
WORKDIR /src
RUN apt-get update && apt-get install -y --no-install-recommends pkg-config libssl-dev git ca-certificates && rm -rf /var/lib/apt/lists/*
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/* \
    && useradd -r -m wpm
USER wpm
WORKDIR /home/wpm
COPY --from=build /src/target/release/wpm /usr/local/bin/wpm
COPY --from=build /src/seed ./seed
ENV PORT=3000 WPM_DATA=/home/wpm/data
EXPOSE 3000
CMD ["wpm"]
