# OWID Documentation

**Work in Progress**

Technical documentation for Our World in Data projects.

## Development

This project uses [uv](https://docs.astral.sh/uv/) for Python dependency management.

### Setup

```bash
# Install dependencies
uv sync

# Serve documentation locally (when Zensical is ready)
uv run zensical serve

# Build documentation
uv run zensical build
```

### Current Status

- **Build System**: MkDocs with Material theme (currently active)
- **Migration Target**: Zensical (Material team's new static site generator)
- **Zensical Status**: Alpha (expected stable release early 2026)

### Configuration Files

- `mkdocs.yml` - Current MkDocs configuration (actively used)
- `zensical.toml` - Future Zensical configuration (ready for migration)
- `pyproject.toml` - Python project dependencies

### Migration to Zensical

Zensical is the successor to Material for MkDocs, built by the same team. Key features:

- **5x faster** rebuild times
- **Backward compatible** - can read existing `mkdocs.yml`
- **Modern design** with new Disco search engine
- **Rust-powered** Markdown parser (coming 2026)

#### When to Migrate

- Monitor [Zensical roadmap](https://zensical.org/about/roadmap/)
- Wait for stable release (expected early 2026)
- Test with `zensical.toml` when CLI is available
- Material for MkDocs will be supported for at least 12 months

#### Migration Steps (when ready)

1. Ensure Zensical ≥0.1.0 is installed
2. Test build: `uv run zensical build`
3. Compare output with MkDocs build
4. Update CI/CD to use Zensical
5. Optionally switch to `zensical.toml` for new features

## Documentation

Visit the documentation at: https://docs.owid.io/