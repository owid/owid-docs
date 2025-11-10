# Migration from MkDocs to Zensical

## Overview

This document tracks the migration from MkDocs + Material theme to Zensical, the next-generation static site generator from the Material for MkDocs team.

## Current Status (November 2025)

### ✅ Completed
- [x] Created `pyproject.toml` for dependency management with uv
- [x] Created `zensical.toml` configuration file (ready for use)
- [x] Updated `.gitignore` for uv and Zensical
- [x] Documented migration path in README.md
- [x] GitHub Actions workflow prepared for Zensical

### ⏳ Waiting For
- [ ] Zensical stable release (expected early 2026)
- [ ] Zensical CLI tools to be functional (current version 0.0.2 is placeholder)
- [ ] Module system for plugins (expected early 2026)
- [ ] CommonMark Markdown parser (Rust-based)

### 🔄 Current State
- **Active**: Using `mkdocs.yml` with Material for MkDocs
- **Prepared**: `zensical.toml` ready for when Zensical is stable
- **CI/CD**: GitHub Actions set to use Zensical (may need fallback to MkDocs temporarily)

## Zensical Benefits

1. **Performance**: 5x faster rebuild times
2. **Search**: New Disco search engine with better ranking and filtering
3. **Modern Design**: Improved visual aesthetics
4. **Rust-Powered**: Better performance and reliability
5. **Backward Compatible**: Can read existing `mkdocs.yml`

## Configuration Comparison

### MkDocs (Current)
- Format: YAML (`mkdocs.yml`)
- Theme: `material`
- Extensions: Python Markdown
- Build: `mkdocs build`
- Serve: `mkdocs serve`

### Zensical (Target)
- Format: TOML (`zensical.toml`) or YAML (backward compatible)
- Theme: `modern` or `classic` variant
- Extensions: CommonMark (Rust) - coming 2026
- Build: `zensical build`
- Serve: `zensical serve`

## Migration Checklist

### Phase 1: Preparation (Current - Q4 2025)
- [x] Install Zensical in development environment
- [x] Create `zensical.toml` configuration
- [x] Update project documentation
- [x] Test compatibility of current setup
- [ ] Monitor Zensical development progress

### Phase 2: Testing (Q1 2026 - when CLI is functional)
- [ ] Test `zensical serve` locally
- [ ] Test `zensical build` output
- [ ] Compare build output with MkDocs
- [ ] Verify all pages render correctly
- [ ] Test navigation and search functionality
- [ ] Validate asset loading (images, CSS, JS)

### Phase 3: Migration (Q1-Q2 2026 - when stable)
- [ ] Update CI/CD to use Zensical
- [ ] Deploy test build to staging
- [ ] Verify production deployment
- [ ] Update documentation for contributors
- [ ] Archive or remove `mkdocs.yml` (optional)

## Compatibility Notes

### Supported Features
- ✅ Basic Markdown content
- ✅ Navigation structure
- ✅ Theme customization (colors, fonts, logo)
- ✅ Social links
- ✅ Custom metadata
- ✅ Asset files (images, favicons)

### Features Requiring Updates
- ⚠️ Python Markdown extensions (will use CommonMark)
- ⚠️ Custom plugins (will use module system)
- ⚠️ Some advanced theme features (check Zensical docs)

### Not Yet Supported (as of 0.0.2)
- ❌ Full plugin ecosystem (coming with module system)
- ❌ Some Material features (achieving feature parity)

## Testing Commands

```bash
# Install dependencies
uv sync

# When Zensical CLI is functional:

# Serve locally (development)
uv run zensical serve

# Build for production
uv run zensical build

# Build with clean output directory
uv run zensical build --clean

# Verify configuration
uv run zensical --version
```

## Rollback Plan

If issues arise with Zensical:

1. **Immediate**: Switch back to `mkdocs.yml`
2. **Update CI/CD**: Change workflow to use `mkdocs build`
3. **Dependencies**: Update `pyproject.toml` to use `mkdocs-material`
4. **Communicate**: Document issues for Zensical team

### Rollback Commands

```bash
# Install MkDocs + Material
uv add mkdocs mkdocs-material

# Build with MkDocs
uv run mkdocs build

# Serve with MkDocs
uv run mkdocs serve
```

## Resources

- [Zensical Documentation](https://zensical.org/docs/)
- [Zensical Roadmap](https://zensical.org/about/roadmap/)
- [Zensical Compatibility](https://zensical.org/compatibility/)
- [Material for MkDocs Blog Post](https://squidfunk.github.io/mkdocs-material/blog/2025/11/05/zensical/)
- [uv Documentation](https://docs.astral.sh/uv/)

## Timeline

- **November 2025**: Initial preparation, Zensical announced
- **Q4 2025 - Q1 2026**: Monitor Zensical development
- **Q1 2026**: Expected module system release
- **Q1-Q2 2026**: Target migration window
- **12+ months**: Material for MkDocs support window

## Notes

- Zensical is currently alpha software (version 0.0.2)
- Material for MkDocs team guarantees 12 months of support
- No rush to migrate - wait for stable release
- Configuration files are ready for seamless transition
- GitHub Actions workflow already configured for Zensical

## Contact

For issues or questions about this migration:
- Check [Zensical documentation](https://zensical.org/docs/)
- Review [compatibility notes](https://zensical.org/compatibility/)
- Monitor the [project roadmap](https://zensical.org/about/roadmap/)
