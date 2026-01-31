# 5분 퀵스타트

이 가이드를 따라 Declutter로 첫 번째 리팩토링을 완료하세요.

---

## 전제 조건 (30초)

- Claude Code CLI가 설치되어 있어야 합니다
- 프로젝트 디렉토리에서 작업해야 합니다
- Git 저장소가 초기화되어 있어야 합니다 (권장)

```bash
# Claude Code 확인
claude --version

# 프로젝트 디렉토리로 이동
cd your-project
```

---

## 1단계: 플러그인 활성화 (30초)

Declutter 플러그인이 프로젝트에 설치되어 있으면 자동으로 로드됩니다.

```bash
# Claude Code 시작
claude
```

플러그인이 로드되면 `/assess`, `/declutter`, `/migrate` 명령어를 사용할 수 있습니다.

---

## 2단계: 코드베이스 평가 (2분)

### 전체 코드베이스 평가

```bash
/assess
```

### 특정 디렉토리 평가

```bash
/assess src/
```

### 심층 분석 (Opus 사용)

```bash
/assess --deep
```

### 예상 출력

```
# Codebase Assessment Report

## Summary
- Overall health: Fair
- Files analyzed: 47
- Total issues: 23

## Complexity Hotspots
| Rank | File                    | Complexity | Lines |
|------|-------------------------|------------|-------|
| 1    | src/services/order.py   | 45         | 320   |
| 2    | src/utils/helpers.py    | 32         | 180   |

## Code Smells
### Critical
- [Long Method] src/services/order.py:45-180 - process_order 함수가 135줄

### High
- [Feature Envy] src/controllers/user.py:23 - 다른 클래스 필드를 과도하게 참조

## Recommendations
1. process_order 함수를 분리하세요 (Critical)
2. Feature Envy를 해결하세요 (High)
```

---

## 3단계: 결과 확인 (1분)

평가 리포트에서 확인할 사항:

### 복잡도 핫스팟
가장 문제가 많은 파일 목록입니다. 우선순위를 정하는 데 사용하세요.

### 코드 스멜
카테고리별로 분류된 문제 목록입니다:
- **Critical**: 즉시 수정 필요
- **High**: 현재 스프린트에서 수정
- **Medium**: 리팩토링 일정에 포함
- **Low**: 기회가 될 때 수정

### 권장 사항
우선순위가 지정된 액션 아이템입니다.

---

## 4단계: 첫 리팩토링 (1분)

가장 문제가 많은 파일을 리팩토링합니다:

```bash
/declutter src/services/order.py
```

### Declutter 워크플로우

```
Phase 1: Assessment
- 스멜 탐지 실행 중...
- 코드 구조 분석 중...
- 리포트 생성 완료.

Phase 2: Planning
평가를 바탕으로 다음을 권장합니다:
1. process_order에서 validate_order 추출 (Critical)
2. process_order에서 calculate_total 추출 (High)
3. 불명확한 변수명 개선 (Low)

이 계획을 승인하시겠습니까? [Yes/Revise/Cancel]

> Yes

Phase 3: Test Harness
- process_order에 대한 특성화 테스트 생성 중...
- 모든 테스트 통과 (8개 테스트)

Phase 4: Refactoring
[Task 1/3] validate_order 추출 중...
- 변경 적용됨
- 테스트: PASSING
- 커밋: abc123

[Task 2/3] calculate_total 추출 중...
- 변경 적용됨
- 테스트: PASSING
- 커밋: def456

Phase 5: Verification
- 모든 테스트 통과
- 새로운 스멜 없음
- 복잡도 35% 감소

VERIFICATION_COMPLETE

리팩토링 완료!
```

---

## 다음 단계

### 더 알아보기
- [Iron Laws](../concepts/iron-laws.md) - Declutter의 핵심 원칙
- [명령어 개요](../commands/overview.md) - 전체 명령어 가이드

### 추가 리팩토링
```bash
# 다음 핫스팟 리팩토링
/declutter src/utils/helpers.py

# 마이그레이션 워크플로우
/migrate strangler --scope=auth
```

### 팁
- 항상 `/assess`로 시작하세요
- 한 번에 하나의 파일만 리팩토링하세요
- 각 변경 후 테스트가 통과하는지 확인하세요
- Git 커밋을 통해 롤백 지점을 유지하세요

---

## 문제 해결

### 명령어가 인식되지 않음
플러그인이 올바르게 설치되었는지 확인하세요.

### 테스트가 실패함
- 리팩토링 전에 기존 테스트가 통과하는지 확인하세요
- 특성화 테스트가 현재 동작을 정확히 캡처했는지 확인하세요

### 변경을 롤백하고 싶음
```bash
# 마지막 커밋 되돌리기
git revert HEAD

# 모든 변경 취소
git checkout -- .
```
