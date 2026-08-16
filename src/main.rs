//! # wpm — the Weft package registry
//!
//! Like npm, with the one difference that changes everything: **packages
//! cannot lie**. Every Weft definition is named by the hash of its canonical
//! bytes, so this server holds no authority — it is a well-lit shelf. Every
//! upload is verified before it is stored (hashes match, exports resolve,
//! the whole def set passes the Weft verifier), and every consumer verifies
//! again locally. Mirrors are equals; the registry can vanish and nothing
//! published breaks.
//!
//! Routes (HTTP/1.1, TLS at the proxy):
//!   GET  /                                       → index JSON (all packages)
//!   GET  /healthz                                → 200 ok
//!   GET  /packages/<name>.weftpack.json          → the package
//!   GET  /.well-known/weft/<name>.weftpack.json  → same (the Thread convention)
//!   POST /publish                                → body = package JSON;
//!        verified before storage. If WPM_TOKEN is set, requires
//!        `authorization: Bearer <token>`; unset = open shelf (dev).
//!
//! Env: PORT (default 3000 — matches the Coolify template), WPM_DATA
//! (default ./data), WPM_TOKEN (optional publish gate).
//! Boot seeds `seed/*.weftpack.json` into an empty data dir.

use std::path::PathBuf;
use std::sync::Arc;

use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use weft::pack::Package;

struct App {
    data: PathBuf,
    token: Option<String>,
}

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    let port: u16 = std::env::var("PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(3000);
    let data = PathBuf::from(std::env::var("WPM_DATA").unwrap_or_else(|_| "data".into()));
    std::fs::create_dir_all(&data).expect("data dir");

    // Seed an empty shelf with the bundled packages (each verified first —
    // the registry never vouches for bytes it hasn't checked).
    if std::fs::read_dir(&data).map(|mut d| d.next().is_none()).unwrap_or(true) {
        if let Ok(entries) = std::fs::read_dir("seed") {
            for e in entries.flatten() {
                let name = e.file_name().to_string_lossy().to_string();
                if !name.ends_with(".weftpack.json") {
                    continue;
                }
                match std::fs::read_to_string(e.path())
                    .ok()
                    .and_then(|t| serde_json::from_str::<Package>(&t).ok().map(|p| (t, p)))
                {
                    Some((text, pkg)) if pkg.verify().is_ok() => {
                        let _ = std::fs::write(data.join(&name), text);
                        println!("seeded {name} ('{}')", pkg.name);
                    }
                    _ => eprintln!("seed {name} REFUSED (invalid or unverifiable)"),
                }
            }
        }
    }

    let app = Arc::new(App {
        data,
        token: std::env::var("WPM_TOKEN").ok().filter(|t| !t.is_empty()),
    });
    let listener = TcpListener::bind(("0.0.0.0", port)).await.expect("bind");
    println!("wpm listening on :{port} — the shelf is open");
    loop {
        let Ok((stream, _)) = listener.accept().await else { continue };
        let app = app.clone();
        tokio::spawn(async move {
            let _ = handle(stream, app).await;
        });
    }
}

async fn handle(mut stream: TcpStream, app: Arc<App>) -> std::io::Result<()> {
    // Read the head + as much body as declared (publishes are small).
    let mut buf: Vec<u8> = Vec::with_capacity(8192);
    let mut tmp = [0u8; 8192];
    let head_end;
    loop {
        let n = stream.read(&mut tmp).await?;
        if n == 0 {
            return Ok(());
        }
        buf.extend_from_slice(&tmp[..n]);
        if let Some(pos) = find(&buf, b"\r\n\r\n") {
            head_end = pos + 4;
            break;
        }
        if buf.len() > 64 * 1024 {
            return respond(&mut stream, 431, "text/plain", b"head too large").await;
        }
    }
    let head = String::from_utf8_lossy(&buf[..head_end]).to_string();
    let mut lines = head.lines();
    let mut request = lines.next().unwrap_or("").split_whitespace();
    let (method, path) = (request.next().unwrap_or(""), request.next().unwrap_or("/"));
    let path = path.split('?').next().unwrap_or(path).to_string();
    let header = |name: &str| -> Option<String> {
        head.lines()
            .find(|l| l.to_ascii_lowercase().starts_with(&format!("{name}:")))
            .map(|l| l[name.len() + 1..].trim().to_string())
    };

    match (method, path.as_str()) {
        ("GET", "/healthz") => respond(&mut stream, 200, "text/plain", b"ok").await,
        ("GET", "/") => {
            let mut list = Vec::new();
            if let Ok(entries) = std::fs::read_dir(&app.data) {
                for e in entries.flatten() {
                    let file = e.file_name().to_string_lossy().to_string();
                    if !file.ends_with(".weftpack.json") {
                        continue;
                    }
                    if let Ok(pkg) = serde_json::from_str::<Package>(
                        &std::fs::read_to_string(e.path()).unwrap_or_default(),
                    ) {
                        list.push(serde_json::json!({
                            "name": pkg.name,
                            "file": file,
                            "url": format!("/packages/{file}"),
                            "exports": pkg.exports.keys().collect::<Vec<_>>(),
                            "defs": pkg.defs.len(),
                        }));
                    }
                }
            }
            list.sort_by_key(|v| v["name"].as_str().unwrap_or_default().to_string());
            let body = serde_json::json!({
                "registry": "wpm",
                "motto": "packages that cannot lie — verify locally, always",
                "spec": "https://github.com/Pixygon/Infinite/blob/main/docs/spec/weft-pack-v0.1.md",
                "packages": list,
            });
            respond(&mut stream, 200, "application/json", body.to_string().as_bytes()).await
        }
        ("GET", p) => {
            let name = p
                .strip_prefix("/packages/")
                .or_else(|| p.strip_prefix("/.well-known/weft/"));
            match name.filter(|n| clean_name(n)) {
                Some(n) => match std::fs::read(app.data.join(n)) {
                    Ok(bytes) => respond(&mut stream, 200, "application/json", &bytes).await,
                    Err(_) => respond(&mut stream, 404, "text/plain", b"no such package").await,
                },
                None => respond(&mut stream, 404, "text/plain", b"not found").await,
            }
        }
        ("POST", "/publish") => {
            if let Some(tok) = &app.token {
                let ok = header("authorization")
                    .is_some_and(|a| a.strip_prefix("Bearer ") == Some(tok.as_str()));
                if !ok {
                    return respond(&mut stream, 401, "text/plain", b"bad token").await;
                }
            }
            let want: usize = header("content-length").and_then(|v| v.parse().ok()).unwrap_or(0);
            if want == 0 || want > 4 * 1024 * 1024 {
                return respond(&mut stream, 413, "text/plain", b"bad content-length (max 4MB)").await;
            }
            let mut body = buf[head_end..].to_vec();
            while body.len() < want {
                let n = stream.read(&mut tmp).await?;
                if n == 0 {
                    break;
                }
                body.extend_from_slice(&tmp[..n]);
            }
            let Ok(text) = String::from_utf8(body) else {
                return respond(&mut stream, 400, "text/plain", b"not utf-8").await;
            };
            let Ok(pkg) = serde_json::from_str::<Package>(&text) else {
                return respond(&mut stream, 400, "text/plain", b"not a weft package").await;
            };
            // The gate that matters: full verification before storage.
            if let Err(e) = pkg.verify() {
                let msg = format!("REFUSED: {e}");
                return respond(&mut stream, 422, "text/plain", msg.as_bytes()).await;
            }
            let file = format!("{}.weftpack.json", slug(&pkg.name));
            if !clean_name(&file) {
                return respond(&mut stream, 400, "text/plain", b"bad package name").await;
            }
            std::fs::write(app.data.join(&file), &text)?;
            println!("published '{}' → {file} ({} defs)", pkg.name, pkg.defs.len());
            let body = serde_json::json!({ "ok": true, "url": format!("/packages/{file}") });
            respond(&mut stream, 200, "application/json", body.to_string().as_bytes()).await
        }
        _ => respond(&mut stream, 405, "text/plain", b"method not allowed").await,
    }
}

/// Registry filenames: kebab alnum + the exact suffix — nothing traverses.
fn clean_name(n: &str) -> bool {
    n.strip_suffix(".weftpack.json").is_some_and(|s| {
        !s.is_empty() && s.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-')
    })
}

fn slug(name: &str) -> String {
    name.to_lowercase()
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

fn find(hay: &[u8], needle: &[u8]) -> Option<usize> {
    hay.windows(needle.len()).position(|w| w == needle)
}

async fn respond(
    stream: &mut TcpStream,
    status: u16,
    ctype: &str,
    body: &[u8],
) -> std::io::Result<()> {
    let reason = match status {
        200 => "OK",
        400 => "Bad Request",
        401 => "Unauthorized",
        404 => "Not Found",
        405 => "Method Not Allowed",
        413 => "Payload Too Large",
        422 => "Unprocessable Entity",
        431 => "Request Header Fields Too Large",
        _ => "",
    };
    let head = format!(
        "HTTP/1.1 {status} {reason}\r\ncontent-type: {ctype}\r\ncontent-length: {}\r\naccess-control-allow-origin: *\r\nconnection: close\r\n\r\n",
        body.len()
    );
    stream.write_all(head.as_bytes()).await?;
    stream.write_all(body).await?;
    stream.flush().await
}
