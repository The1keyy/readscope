# Contributing to ReadScope

Thanks for your interest in contributing! Whether you're fixing a bug, suggesting a feature, or improving the docs — all contributions are welcome.

---

## Getting Started

If you haven't already, follow the setup instructions in the [README](./README.md) to get the project running locally before making any changes.

---

## Ways to Contribute

- **Bug reports** — Found something broken? Open an issue with steps to reproduce it
- **Feature suggestions** — Have an idea? Open an issue and describe what you'd like to see and why
- **Code contributions** — Bug fixes, new features, performance improvements, or refactors
- **Documentation** — Improving the README, adding inline comments, or clarifying existing docs
- **Testing** — Writing or improving tests is always appreciated

---

## Opening an Issue

Before opening a new issue, do a quick search to see if it already exists.

When filing a bug report, please include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Your Python version and OS

For feature requests, describe the problem you're trying to solve — not just the solution you have in mind.

---

## Submitting a Pull Request

1. **Fork the repository** and create your branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes.** Keep commits focused — one logical change per commit.

3. **Follow the existing code style.** The project uses standard Python conventions (PEP 8). Run a linter if you have one set up.

4. **Test your changes** before submitting. If you're adding new functionality, include tests where possible.

5. **Write a clear PR description** explaining what you changed and why. Reference any related issues with `Closes #issue-number` if applicable.

6. **Open the pull request** against the `main` branch.

---

## Branch Naming

Use descriptive branch names that reflect what you're working on:

| Type | Format | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/audio-upload` |
| Bug fix | `fix/short-description` | `fix/accuracy-score-edge-case` |
| Documentation | `docs/short-description` | `docs/update-readme` |
| Refactor | `refactor/short-description` | `refactor/analysis-service` |

---

## Commit Messages

Write commit messages in the imperative mood and keep them concise:

```
✅ Add fluency score calculation
✅ Fix missing word count off-by-one error
✅ Update analysis endpoint documentation

❌ fixed stuff
❌ changes
❌ WIP
```

---

## Project Structure Primer

If you're new to the codebase, here are the most important areas:

| Path | What it does |
|---|---|
| `app/api/routes/` | All API endpoints (auth, sessions, analysis) |
| `app/services/analysis_service.py` | Core reading analysis logic |
| `app/db/models/` | SQLAlchemy database models |
| `app/schemas/` | Pydantic request/response schemas |
| `app/core/` | Config and security utilities |

---

## Code of Conduct

Please review and follow the [Code of Conduct](./CODE_OF_CONDUCT.md). All contributors are expected to uphold it.

---

## Questions

Not sure where to start or have a question about the codebase? Open a discussion or issue — there are no dumb questions.
