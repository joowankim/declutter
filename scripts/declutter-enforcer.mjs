#!/usr/bin/env node

/**
 * Declutter Enforcer Script
 *
 * PreToolUse hook that enforces declutter refactoring rules:
 * - No structural changes without characterization tests
 * - No multiple changes in one commit
 * - No proceeding without green tests
 *
 * Usage in hooks.json:
 * {
 *   "PreToolUse": [{
 *     "matcher": "*",
 *     "hooks": [{
 *       "type": "command",
 *       "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/declutter-enforcer.mjs\""
 *     }]
 *   }]
 * }
 */

// Phase tracking state
const phases = {
  assessment: false,
  planning: false,
  harness: false,
  refactoring: false,
  verification: false
};

// Phase prerequisites
const phasePrerequisites = {
  assessment: [],
  planning: ['assessment'],
  harness: ['planning'],
  refactoring: ['harness'],
  verification: ['refactoring']
};

// Read-only tools that are always allowed
const READ_ONLY_TOOLS = ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch'];

// Structural change types that require tests
const STRUCTURAL_CHANGES = [
  'extract_method',
  'extract_class',
  'move_method',
  'move_class',
  'rename',
  'inline',
  'replace_conditional'
];

// Non-structural changes that don't require test harness
const NON_STRUCTURAL_CHANGES = [
  'formatting',
  'comments',
  'whitespace'
];

/**
 * Check if refactoring rules allow this tool use
 *
 * @param {Object} context - Tool use context
 * @param {string} context.tool - Name of the tool being used
 * @param {string} context.mode - Current workflow mode
 * @param {number|null} context.lastTestRun - Timestamp of last test run
 * @param {boolean|null} context.testsPassing - Whether tests are passing
 * @returns {{ allowed: boolean, message: string }}
 */
export function checkRefactoringRules(context) {
  const { tool, mode, lastTestRun, testsPassing } = context;

  // Read-only tools are always allowed
  if (READ_ONLY_TOOLS.includes(tool)) {
    return { allowed: true, message: 'Read-only tool allowed' };
  }

  // Non-refactoring modes don't have restrictions
  if (mode !== 'refactoring') {
    return { allowed: true, message: 'Not in refactoring mode' };
  }

  // In refactoring mode, Edit/Write require passing tests
  if (tool === 'Edit' || tool === 'Write') {
    if (lastTestRun === null) {
      return {
        allowed: false,
        message: 'BLOCKED: Must run tests before making changes. The Iron Law: NO STRUCTURAL CHANGE WITHOUT TEST FIRST.'
      };
    }

    if (testsPassing === false) {
      return {
        allowed: false,
        message: 'BLOCKED: Tests are failing. Fix tests before making new changes.'
      };
    }

    // Tests exist and are passing
    return { allowed: true, message: 'Tests passing, change allowed' };
  }

  // Other tools allowed
  return { allowed: true, message: 'Tool allowed' };
}

/**
 * Check if a test harness is required for the given change
 *
 * @param {Object} context - Change context
 * @param {string} context.changeType - Type of change being made
 * @param {boolean} context.hasCharacterizationTests - Whether tests exist
 * @returns {boolean}
 */
export function isTestHarnessRequired(context) {
  const { changeType, hasCharacterizationTests } = context;

  // Non-structural changes don't need harness
  if (NON_STRUCTURAL_CHANGES.includes(changeType)) {
    return false;
  }

  // Structural changes need harness unless tests already exist
  if (STRUCTURAL_CHANGES.includes(changeType)) {
    return !hasCharacterizationTests;
  }

  // Default: require harness for unknown change types
  return !hasCharacterizationTests;
}

/**
 * Validate that changes are atomic (single logical change)
 *
 * @param {Array} changes - List of changes being made
 * @returns {{ valid: boolean, reason: string }}
 */
export function validateAtomicChange(changes) {
  if (changes.length === 0) {
    return { valid: true, reason: 'No changes' };
  }

  if (changes.length === 1) {
    return { valid: true, reason: 'Single change is atomic' };
  }

  // Multiple changes - check if they're related
  const firstFile = changes[0].file;
  const allSameFile = changes.every(c => c.file === firstFile);
  const allRelated = changes.every((c, i) => i === 0 || c.relatedTo !== undefined);

  if (allSameFile && allRelated) {
    return { valid: true, reason: 'Related changes in same file' };
  }

  // Multiple unrelated changes
  return {
    valid: false,
    reason: 'BLOCKED: Multiple unrelated changes detected. Make ONE atomic change at a time.'
  };
}

/**
 * Check if a phase is complete
 * @param {string} phase - Phase name
 * @returns {boolean}
 */
export function isPhaseComplete(phase) {
  return phases[phase] === true;
}

/**
 * Mark a phase as complete
 * @param {string} phase - Phase name
 */
export function markPhaseComplete(phase) {
  phases[phase] = true;
}

/**
 * Check if a phase can be started (prerequisites met)
 * @param {string} phase - Phase name
 * @returns {boolean}
 */
export function canStartPhase(phase) {
  const prerequisites = phasePrerequisites[phase] || [];
  return prerequisites.every(prereq => phases[prereq] === true);
}

/**
 * Reset all phases (for testing)
 */
export function resetPhases() {
  Object.keys(phases).forEach(key => {
    phases[key] = false;
  });
}

/**
 * Main hook handler - reads from stdin and outputs result
 */
async function main() {
  // Read hook input from stdin
  let input = '';

  if (process.stdin.isTTY) {
    // No stdin, probably being tested
    console.log('Declutter enforcer loaded');
    return;
  }

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const hookData = JSON.parse(input);
    const { tool_name, tool_input } = hookData;

    // For now, allow everything but log what we're seeing
    // In production, this would integrate with phase tracking

    const context = {
      tool: tool_name,
      mode: process.env.DECLUTTER_MODE || 'normal',
      lastTestRun: process.env.DECLUTTER_LAST_TEST_RUN
        ? parseInt(process.env.DECLUTTER_LAST_TEST_RUN)
        : null,
      testsPassing: process.env.DECLUTTER_TESTS_PASSING === 'true'
        ? true
        : process.env.DECLUTTER_TESTS_PASSING === 'false'
          ? false
          : null
    };

    const result = checkRefactoringRules(context);

    if (!result.allowed) {
      // Output block message
      console.error(result.message);
      process.exit(1);
    }

    // Allow the tool
    process.exit(0);

  } catch (error) {
    // On error, allow the tool but log the issue
    console.error(`Declutter enforcer error: ${error.message}`);
    process.exit(0);
  }
}

// Run main if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
