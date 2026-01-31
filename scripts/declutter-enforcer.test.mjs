/**
 * Tests for declutter-enforcer.mjs
 *
 * TDD: These tests are written FIRST, before the implementation.
 * Run with: node --test scripts/declutter-enforcer.test.mjs
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

// We'll import from the enforcer once it exists
// For now, define the expected interface

/**
 * Expected interface:
 * - checkRefactoringRules(toolInput) -> { allowed: boolean, message: string }
 * - isTestHarnessRequired(context) -> boolean
 * - validateAtomicChange(changes) -> { valid: boolean, reason: string }
 */

describe('Declutter Enforcer', () => {

  describe('checkRefactoringRules', () => {

    it('should block Edit without prior test run in refactoring mode', async () => {
      const { checkRefactoringRules } = await import('./declutter-enforcer.mjs');

      const context = {
        tool: 'Edit',
        mode: 'refactoring',
        lastTestRun: null,
        testsPassing: null
      };

      const result = checkRefactoringRules(context);

      assert.equal(result.allowed, false);
      assert.ok(result.message.includes('test'));
    });

    it('should allow Edit after tests pass', async () => {
      const { checkRefactoringRules } = await import('./declutter-enforcer.mjs');

      const context = {
        tool: 'Edit',
        mode: 'refactoring',
        lastTestRun: Date.now() - 1000, // 1 second ago
        testsPassing: true
      };

      const result = checkRefactoringRules(context);

      assert.equal(result.allowed, true);
    });

    it('should block Edit if tests are failing', async () => {
      const { checkRefactoringRules } = await import('./declutter-enforcer.mjs');

      const context = {
        tool: 'Edit',
        mode: 'refactoring',
        lastTestRun: Date.now() - 1000,
        testsPassing: false
      };

      const result = checkRefactoringRules(context);

      assert.equal(result.allowed, false);
      assert.ok(result.message.includes('failing'));
    });

    it('should allow Read in any mode', async () => {
      const { checkRefactoringRules } = await import('./declutter-enforcer.mjs');

      const context = {
        tool: 'Read',
        mode: 'refactoring',
        lastTestRun: null,
        testsPassing: null
      };

      const result = checkRefactoringRules(context);

      assert.equal(result.allowed, true);
    });

    it('should allow any tool in non-refactoring mode', async () => {
      const { checkRefactoringRules } = await import('./declutter-enforcer.mjs');

      const context = {
        tool: 'Edit',
        mode: 'assessment',
        lastTestRun: null,
        testsPassing: null
      };

      const result = checkRefactoringRules(context);

      assert.equal(result.allowed, true);
    });
  });

  describe('isTestHarnessRequired', () => {

    it('should require test harness for structural changes', async () => {
      const { isTestHarnessRequired } = await import('./declutter-enforcer.mjs');

      const context = {
        changeType: 'extract_method',
        hasCharacterizationTests: false
      };

      const result = isTestHarnessRequired(context);

      assert.equal(result, true);
    });

    it('should not require harness if characterization tests exist', async () => {
      const { isTestHarnessRequired } = await import('./declutter-enforcer.mjs');

      const context = {
        changeType: 'extract_method',
        hasCharacterizationTests: true
      };

      const result = isTestHarnessRequired(context);

      assert.equal(result, false);
    });

    it('should not require harness for non-structural changes', async () => {
      const { isTestHarnessRequired } = await import('./declutter-enforcer.mjs');

      const context = {
        changeType: 'formatting',
        hasCharacterizationTests: false
      };

      const result = isTestHarnessRequired(context);

      assert.equal(result, false);
    });
  });

  describe('validateAtomicChange', () => {

    it('should validate single file change as atomic', async () => {
      const { validateAtomicChange } = await import('./declutter-enforcer.mjs');

      const changes = [
        { file: 'src/auth.py', type: 'rename', scope: 'variable' }
      ];

      const result = validateAtomicChange(changes);

      assert.equal(result.valid, true);
    });

    it('should reject multiple unrelated changes', async () => {
      const { validateAtomicChange } = await import('./declutter-enforcer.mjs');

      const changes = [
        { file: 'src/auth.py', type: 'rename', scope: 'variable' },
        { file: 'src/orders.py', type: 'extract_method', scope: 'function' }
      ];

      const result = validateAtomicChange(changes);

      assert.equal(result.valid, false);
      assert.ok(result.reason.includes('atomic'));
    });

    it('should allow related changes in same file', async () => {
      const { validateAtomicChange } = await import('./declutter-enforcer.mjs');

      const changes = [
        { file: 'src/auth.py', type: 'extract_method', scope: 'function' },
        { file: 'src/auth.py', type: 'update_call_site', scope: 'function', relatedTo: 0 }
      ];

      const result = validateAtomicChange(changes);

      assert.equal(result.valid, true);
    });
  });

  describe('Phase validation', () => {

    it('should track phase completion signals', async () => {
      const { isPhaseComplete, markPhaseComplete } = await import('./declutter-enforcer.mjs');

      assert.equal(isPhaseComplete('assessment'), false);

      markPhaseComplete('assessment');

      assert.equal(isPhaseComplete('assessment'), true);
    });

    it('should enforce phase order', async () => {
      const { canStartPhase, resetPhases } = await import('./declutter-enforcer.mjs');

      resetPhases();

      // Can start assessment without prerequisites
      assert.equal(canStartPhase('assessment'), true);

      // Cannot start harness without assessment
      assert.equal(canStartPhase('harness'), false);

      // Cannot start refactoring without harness
      assert.equal(canStartPhase('refactoring'), false);
    });
  });
});

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running declutter-enforcer tests...');
}
