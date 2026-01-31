# Declutter

**Safe, test-driven refactoring plugin for Claude Code**

Legacy code cleanup with systematic assessment, behavior-preserving tests, and atomic changes.

---

## Installation

### From Marketplace

```bash
# Add the marketplace
/plugin marketplace add joowankim/declutter

# Install the plugin
/plugin install declutter@declutter
```

### From Local Directory

```bash
/plugin install /path/to/declutter
```

---

## Quick Start (5 minutes)

### 1. Assess Your Codebase

```bash
/assess src/
```

Identifies code smells, complexity hotspots, and refactoring opportunities.

### 2. Start Refactoring

```bash
/declutter src/problematic-module.py
```

Automatically starts the 5-step workflow:
- Assess → Plan → Test Harness → Refactor → Verify

### 3. Check Results

All tests pass, behavior is preserved, and code quality is improved.

---

## Iron Laws

Declutter follows three iron laws:

| Iron Law | Meaning |
|----------|---------|
| **No refactoring without assessment** | Never change code before understanding it |
| **No code changes without tests** | Capture behavior with characterization tests first |
| **No completion without verification** | Confirm all tests pass |

---

## Commands

| Command | Purpose |
|---------|---------|
| `/assess` | Codebase quality assessment |
| `/declutter` | Start refactoring workflow |
| `/migrate` | Gradual migration |

---

## Agent System

Declutter uses specialized agents:

| Agent | Role | Model |
|-------|------|-------|
| `declutter-analyzer` | Code analysis | Sonnet |
| `declutter-smell-detector` | Smell detection | Haiku |
| `declutter-executor` | Refactoring execution | Sonnet |
| `declutter-reviewer` | Final verification | Opus |

---

## Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   /assess   │ ──▶ │  /declutter │ ──▶ │   Done      │
│  Analyze    │     │  Refactor   │     │  Improved   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
  Assessment          5-Step Workflow
   Report         (Assess→Plan→Test→Execute→Verify)
```

---

## Documentation

See [docs/](docs/) for detailed documentation:
- [Quick Start](docs/getting-started/quickstart.md)
- [Iron Laws](docs/concepts/iron-laws.md)
- [Commands Overview](docs/commands/overview.md)

---

## License

MIT License - see [LICENSE](LICENSE) for details.
