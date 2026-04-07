//! cortex-check: structural integrity check for the .cortex/ knowledge base.
//!
//! Checks:
//!   1. All local markdown links in .cortex/**/*.md resolve to real files/dirs
//!   2. All local markdown links in CLAUDE.md and .agents/*.md resolve to real files/dirs
//!   3. Store inventory in .cortex/references/rexie-patterns.md matches rexie_schema.rs
//!
//! Run from the repo root: `cargo run --manifest-path tools/cortex-check/Cargo.toml`
//! Exit code 1 on any failure.

use pulldown_cmark::{Event, Options, Parser, Tag};
use regex::Regex;
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

fn main() {
    let root = PathBuf::from(".");
    let mut checker = Checker::new(root);

    checker.check_cortex_links();
    checker.check_entry_links();
    checker.check_store_inventory();
    checker.report();
}

struct Checker {
    root: PathBuf,
    errors: Vec<String>,
}

impl Checker {
    fn new(root: PathBuf) -> Self {
        Self { root, errors: Vec::new() }
    }

    fn fail(&mut self, msg: impl Into<String>) {
        let msg = msg.into();
        eprintln!("  ✗ {msg}");
        self.errors.push(msg);
    }

    fn pass(&self, msg: &str) {
        println!("  ✓ {msg}");
    }

    fn section(&self, title: &str) {
        println!("\n── {title}");
    }

    fn md_files(&self, dir: &Path) -> Vec<PathBuf> {
        WalkDir::new(dir)
            .sort_by_file_name()
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| e.path().extension().and_then(|s| s.to_str()) == Some("md"))
            .map(|e| e.into_path())
            .collect()
    }

    fn check_links_in_file(&mut self, file_path: &Path) -> usize {
        let content = match fs::read_to_string(file_path) {
            Ok(c) => c,
            Err(e) => {
                self.fail(format!("{} — could not read: {e}", rel(file_path)));
                return 0;
            }
        };
        let file_dir = file_path.parent().unwrap_or(Path::new("."));
        let links = local_links(&content);

        for (href, line) in &links {
            if !file_dir.join(href).exists() {
                self.fail(format!("{}:{line} — broken link \"{href}\"", rel(file_path)));
            }
        }
        links.len()
    }

    // ── Checks ────────────────────────────────────────────────────────────────

    fn check_cortex_links(&mut self) {
        self.section("1. Local links in .cortex/**/*.md");
        let files = self.md_files(&self.root.join(".cortex"));
        let before = self.errors.len();
        let total: usize = files.iter().map(|f| self.check_links_in_file(f)).sum();
        if self.errors.len() == before {
            self.pass(&format!("{} files, {total} links — all resolve", files.len()));
        }
    }

    fn check_entry_links(&mut self) {
        self.section("2. Local links in CLAUDE.md and .agents/*.md");
        let mut files = vec![self.root.join("CLAUDE.md")];
        files.extend(self.md_files(&self.root.join(".agents")));

        let before = self.errors.len();
        let mut total = 0;
        for f in &files {
            if !f.exists() {
                self.fail(format!("missing entry file: {}", rel(f)));
            } else {
                total += self.check_links_in_file(f);
            }
        }
        if self.errors.len() == before {
            self.pass(&format!("{} files, {total} links — all resolve", files.len()));
        }
    }

    fn check_store_inventory(&mut self) {
        self.section("3. Store inventory: rexie-patterns.md ↔ rexie_schema.rs");

        let patterns_path = self.root.join(".cortex/references/rexie-patterns.md");
        let schema_path = self.root.join("me-ai-core/src/db/rexie_schema.rs");

        let (patterns_content, schema_content) = match (
            fs::read_to_string(&patterns_path),
            fs::read_to_string(&schema_path),
        ) {
            (Ok(p), Ok(s)) => (p, s),
            (Err(_), _) => {
                self.fail(format!("missing: {}", rel(&patterns_path)));
                return;
            }
            (_, Err(_)) => {
                self.fail(format!("missing: {}", rel(&schema_path)));
                return;
            }
        };

        let doc = doc_stores(&patterns_content);
        let code = code_stores(&schema_content);

        let before = self.errors.len();
        for s in sorted(&doc) {
            if !code.contains(&s) {
                self.fail(format!(
                    "rexie-patterns.md lists \"{s}\" — not found in rexie_schema.rs"
                ));
            }
        }
        for s in sorted(&code) {
            if !doc.contains(&s) {
                self.fail(format!(
                    "rexie_schema.rs defines \"{s}\" — missing from rexie-patterns.md"
                ));
            }
        }
        if self.errors.len() == before {
            self.pass(&format!("{} stores — inventory matches schema", code.len()));
        }
    }

    fn report(&self) {
        println!();
        if self.errors.is_empty() {
            println!("cortex-check: all checks passed ✓");
        } else {
            let n = self.errors.len();
            eprintln!(
                "cortex-check: {n} error{}. Fix before merging.",
                if n == 1 { "" } else { "s" }
            );
            std::process::exit(1);
        }
    }
}

// ── Markdown link extraction ──────────────────────────────────────────────────

/// Return `(href, line)` for every local link in a markdown document.
/// Uses pulldown-cmark so escaped brackets, inline code, and reference links
/// are all handled correctly.
fn local_links(content: &str) -> Vec<(String, usize)> {
    Parser::new_ext(content, Options::empty())
        .into_offset_iter()
        .filter_map(|(event, range)| match event {
            Event::Start(Tag::Link { dest_url, .. }) => {
                let href = dest_url.split('#').next().unwrap_or("").trim().to_string();
                if href.is_empty() || href.starts_with("http://") || href.starts_with("https://") {
                    return None;
                }
                let line = content[..range.start].chars().filter(|&c| c == '\n').count() + 1;
                Some((href, line))
            }
            _ => None,
        })
        .collect()
}

// ── Store parsers ─────────────────────────────────────────────────────────────

/// Backtick-quoted identifiers in the "## Store inventory" section of a markdown doc.
fn doc_stores(content: &str) -> HashSet<String> {
    let re = Regex::new(r"`([A-Za-z][A-Za-z0-9_]*)`").unwrap();
    let section = content.split("## Store inventory").nth(1).unwrap_or("");
    re.captures_iter(section).map(|c| c[1].to_string()).collect()
}

/// String literals from `pub const X: &str = "name"` lines.
fn code_stores(content: &str) -> HashSet<String> {
    let re = Regex::new(r#"pub const [A-Za-z0-9_]+:[ \t]*&str[ \t]*=[ \t]*"([^"]+)""#).unwrap();
    re.captures_iter(content).map(|c| c[1].to_string()).collect()
}

// ── Utilities ─────────────────────────────────────────────────────────────────

fn rel(path: &Path) -> String {
    path.strip_prefix(".").unwrap_or(path).display().to_string()
}

fn sorted(set: &HashSet<String>) -> Vec<String> {
    let mut v: Vec<_> = set.iter().cloned().collect();
    v.sort();
    v
}
