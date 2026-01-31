---
name: declutter-smell-detection
description: Code smell detection based on Martin Fowler's refactoring catalog - identifies quality issues and refactoring opportunities
invocation: Use when analyzing code for quality issues before refactoring
---

# Code Smell Detection

This skill provides a systematic approach to identifying code smells based on Martin Fowler's refactoring catalog.

## Smell Categories

### 1. Bloaters

Code that has grown too large to handle effectively.

#### Long Method
**Signs:**
- Method longer than 20 lines
- Multiple levels of indentation
- Comments explaining what code does (not why)
- Difficulty naming the method

**Detection Pattern:**
```
- Count lines in method
- Count nesting depth
- Look for inline comments explaining code blocks
```

**Refactoring:** Extract Method

#### Large Class
**Signs:**
- Class with more than 200 lines
- More than 10 methods
- Multiple unrelated responsibilities
- "And" in class name (UserAndOrderManager)

**Detection Pattern:**
```
- Count methods and fields
- Identify cohesion (do fields relate to each other?)
- Check for multiple domains in one class
```

**Refactoring:** Extract Class, Extract Subclass

#### Long Parameter List
**Signs:**
- More than 3 parameters
- Boolean parameters
- Parameters that are always passed together

**Detection Pattern:**
```
- Count parameters
- Look for boolean flags
- Identify parameter groups
```

**Refactoring:** Introduce Parameter Object, Replace Parameter with Method Call

#### Data Clumps
**Signs:**
- Same group of variables passed together
- Similar fields in multiple classes
- Repeated parameter groups

**Detection Pattern:**
```
- Find repeated parameter combinations
- Look for similar field groups
```

**Refactoring:** Extract Class, Introduce Parameter Object

### 2. Object-Orientation Abusers

Incomplete or incorrect application of OO principles.

#### Switch Statements
**Signs:**
- Switch/case on type codes
- Repeated type checking
- instanceof chains
- Similar conditionals in multiple methods

**Detection Pattern:**
```
- Find switch statements
- Look for type checking patterns
- Identify polymorphism opportunities
```

**Refactoring:** Replace Conditional with Polymorphism, Replace Type Code with Subclasses

#### Parallel Inheritance Hierarchies
**Signs:**
- Creating subclass in one hierarchy requires subclass in another
- Prefixes match between hierarchies (DesktopController, DesktopView)

**Detection Pattern:**
```
- Compare class hierarchies
- Look for matching prefixes
```

**Refactoring:** Move Method, Move Field to consolidate hierarchies

#### Refused Bequest
**Signs:**
- Subclass only uses some inherited methods
- Overrides methods to do nothing
- Subclass throws NotImplementedException

**Detection Pattern:**
```
- Find empty method overrides
- Look for NotImplemented patterns
- Check inheritance usage
```

**Refactoring:** Replace Inheritance with Delegation

### 3. Change Preventers

Patterns that make code hard to modify.

#### Divergent Change
**Signs:**
- One class modified for multiple unrelated reasons
- Changes to one feature require changes to many methods
- Class is a "God class"

**Detection Pattern:**
```
- Analyze git history for change patterns
- Identify unrelated modifications
- Check commit messages for variety
```

**Refactoring:** Extract Class (one per change reason)

#### Shotgun Surgery
**Signs:**
- One change requires modifications in many classes
- Related code scattered across codebase
- Features spread thin

**Detection Pattern:**
```
- Trace feature implementation across files
- Count files touched per feature
```

**Refactoring:** Move Method, Move Field, Inline Class

### 4. Dispensables

Unnecessary code that can be removed.

#### Dead Code
**Signs:**
- Unreachable code after return/throw
- Unused variables, parameters, methods
- Commented-out code
- Feature flags that are always on/off

**Detection Pattern:**
```
- Static analysis for unused symbols
- Find unreachable code paths
- Detect TODO/FIXME/deprecated markers
```

**Refactoring:** Delete (safely, with tests)

#### Duplicate Code
**Signs:**
- Copy-pasted blocks
- Similar methods with minor variations
- Same algorithm implemented differently

**Detection Pattern:**
```
- Token-based similarity detection
- AST comparison
- Manual inspection of related code
```

**Refactoring:** Extract Method, Extract Class, Template Method

#### Speculative Generality
**Signs:**
- Abstract classes with single implementation
- Parameters never used
- Methods only called in tests
- "Future-proofing" comments

**Detection Pattern:**
```
- Find abstract types with one implementation
- Check parameter usage
- Analyze call sites
```

**Refactoring:** Collapse Hierarchy, Inline Class, Remove Parameter

### 5. Couplers

Excessive coupling between classes.

#### Feature Envy
**Signs:**
- Method uses more features from another class than its own
- Long chains of getters
- Data class with logic elsewhere

**Detection Pattern:**
```
- Count references to other classes vs own fields
- Identify data access patterns
```

**Refactoring:** Move Method, Extract Method then Move

#### Inappropriate Intimacy
**Signs:**
- Classes access each other's private parts
- Bidirectional dependencies
- Friend classes / package-private abuse

**Detection Pattern:**
```
- Analyze access patterns
- Check for circular dependencies
```

**Refactoring:** Move Method, Move Field, Hide Delegate

#### Message Chains
**Signs:**
- `a.getB().getC().getD().doSomething()`
- Law of Demeter violations
- Navigation through object graph

**Detection Pattern:**
```
- Find long method chains
- Count dots in expressions
```

**Refactoring:** Hide Delegate, Extract Method

## Detection Checklist

When analyzing code, check for each smell category:

```markdown
## Bloaters
- [ ] Long Method (>20 lines)
- [ ] Large Class (>200 lines, >10 methods)
- [ ] Long Parameter List (>3 params)
- [ ] Data Clumps

## OO Abusers
- [ ] Switch Statements on type
- [ ] Parallel Inheritance
- [ ] Refused Bequest

## Change Preventers
- [ ] Divergent Change
- [ ] Shotgun Surgery

## Dispensables
- [ ] Dead Code
- [ ] Duplicate Code
- [ ] Speculative Generality

## Couplers
- [ ] Feature Envy
- [ ] Inappropriate Intimacy
- [ ] Message Chains
```

## Severity Levels

Classify each smell by impact:

| Level | Impact | Action |
|-------|--------|--------|
| **Critical** | Blocks development, causes bugs | Fix immediately |
| **High** | Significantly slows development | Fix in current sprint |
| **Medium** | Causes friction | Schedule for refactoring |
| **Low** | Minor inconvenience | Address opportunistically |

## Output Format

Report findings in this format:

```markdown
# Smell Detection Report

## Summary
- Total smells found: N
- Critical: X
- High: Y
- Medium: Z
- Low: W

## Findings

### [CRITICAL] Long Method in UserService.processOrder
- **Location:** src/services/user_service.py:145-287
- **Lines:** 142
- **Issue:** Method handles order validation, payment, inventory, and notification
- **Recommendation:** Extract into separate methods per responsibility
- **Refactoring:** Extract Method (4-5 extractions needed)

### [HIGH] Feature Envy in OrderController.calculateTotal
- **Location:** src/controllers/order_controller.py:78
- **Issue:** Method accesses 8 fields from PricingService, only 1 from self
- **Recommendation:** Move method to PricingService
- **Refactoring:** Move Method
```
