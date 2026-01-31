---
name: declutter-assessment
description: Codebase assessment skill - evaluates code quality, identifies hotspots, and prioritizes refactoring opportunities
invocation: Use at the start of any refactoring project to understand the current state
---

# Codebase Assessment

## Purpose

Systematically evaluate a codebase to understand its current state, identify quality issues, and prioritize refactoring opportunities.

## The Assessment Rule

```
NO REFACTORING WITHOUT COMPLETE ASSESSMENT FIRST
```

Rushing into refactoring without understanding the codebase leads to:
- Fixing symptoms instead of root causes
- Missing critical dependencies
- Breaking hidden functionality
- Wasted effort on low-value changes

## Assessment Phases

### Phase 1: Structural Analysis

**Objective:** Understand the codebase architecture.

```markdown
1. Map the directory structure
2. Identify entry points
3. Trace dependencies between modules
4. Document build and test configuration
```

**Output:**
- Architecture diagram
- Module dependency graph
- Build/test commands

### Phase 2: Complexity Hotspots

**Objective:** Find the most problematic areas.

**Metrics to collect:**
| Metric | Tool | Threshold |
|--------|------|-----------|
| Cyclomatic Complexity | radon/escomplex | >10 = high |
| Lines per file | wc -l | >500 = review |
| Lines per function | AST analysis | >50 = extract |
| Nesting depth | AST analysis | >4 = flatten |
| Import count | grep/AST | >15 = god module |

**Output:**
- Ranked list of complexity hotspots
- Visualization of problem areas

### Phase 3: Code Smell Detection

**Objective:** Identify specific quality issues.

Invoke `declutter:smell-detection` skill and document findings:

```markdown
- [ ] Bloaters identified
- [ ] OO Abusers identified
- [ ] Change Preventers identified
- [ ] Dispensables identified
- [ ] Couplers identified
```

**Output:**
- Smell report with severity levels

### Phase 4: Test Coverage Analysis

**Objective:** Understand existing test safety net.

```markdown
1. Run coverage tool (pytest-cov, istanbul, etc.)
2. Identify untested critical paths
3. Map coverage to complexity hotspots
4. Flag high-complexity + low-coverage areas
```

**Output:**
- Coverage report
- Risk matrix (complexity vs coverage)

### Phase 5: Change History Analysis

**Objective:** Find areas that change frequently.

```bash
# Most frequently changed files
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -20

# Files with most authors (potential knowledge gaps)
git log --pretty=format:'%an' --name-only | ...

# Recent churn (files changed in last month)
git log --since="1 month ago" --pretty=format: --name-only | sort | uniq -c | sort -rg
```

**Output:**
- Change frequency analysis
- Knowledge distribution map

## Assessment Report Template

```markdown
# Codebase Assessment Report

## Executive Summary
- Overall health: [Good/Fair/Poor/Critical]
- Primary concerns: [list top 3]
- Recommended focus areas: [list]
- Estimated effort: [Small/Medium/Large/Epic]

## Structural Overview
- Total files: N
- Total lines: N
- Primary languages: [list]
- Architecture style: [Monolith/Modular/Microservices/...]

## Complexity Analysis
| Rank | File | Complexity | Lines | Risk |
|------|------|------------|-------|------|
| 1 | path/to/file | 45 | 800 | HIGH |
| 2 | ... | ... | ... | ... |

## Code Smells Summary
| Category | Count | Critical | High | Medium | Low |
|----------|-------|----------|------|--------|-----|
| Bloaters | N | X | Y | Z | W |
| OO Abusers | N | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

## Test Coverage
- Overall coverage: X%
- Critical path coverage: Y%
- Untested hotspots: [list]

## Change Analysis
- Most volatile files: [list top 5]
- Knowledge concentration: [High/Medium/Low]
- Recent focus areas: [list]

## Prioritized Recommendations

### Immediate Actions (Block development)
1. [Issue] - [Location] - [Suggested fix]

### High Priority (Next sprint)
1. [Issue] - [Location] - [Suggested fix]

### Medium Priority (Scheduled refactoring)
1. [Issue] - [Location] - [Suggested fix]

### Low Priority (Opportunistic)
1. [Issue] - [Location] - [Suggested fix]

## Next Steps
1. Review this assessment with the team
2. Approve refactoring priorities
3. Begin with `declutter:planning` for approved items
```

## Assessment Checklist

```markdown
- [ ] Directory structure mapped
- [ ] Entry points identified
- [ ] Dependencies traced
- [ ] Build commands documented
- [ ] Test commands documented
- [ ] Complexity metrics collected
- [ ] Hotspots ranked
- [ ] Code smells detected
- [ ] Smell severity assigned
- [ ] Test coverage analyzed
- [ ] Coverage gaps identified
- [ ] Change history analyzed
- [ ] Volatile files identified
- [ ] Report generated
- [ ] Priorities recommended
```

## Signal

When assessment is complete, emit:

```
ASSESSMENT_COMPLETE
```
