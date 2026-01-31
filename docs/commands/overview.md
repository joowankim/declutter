# 명령어 개요

Declutter는 세 가지 핵심 명령어를 제공합니다.

---

## 명령어 요약

| 명령어 | 용도 | 언제 사용 |
|--------|------|----------|
| `/assess` | 코드베이스 평가 | 리팩토링 전, 품질 현황 파악 시 |
| `/declutter` | 리팩토링 워크플로우 | 레거시 코드 정리 시 |
| `/migrate` | 점진적 마이그레이션 | 대규모 시스템 현대화 시 |

---

## 워크플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                        일반적인 워크플로우                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐      ┌──────────────┐      ┌──────────────┐     │
│   │ /assess  │ ───▶ │  /declutter  │ ───▶ │    완료      │     │
│   │          │      │              │      │              │     │
│   │ 품질 평가 │      │ 리팩토링     │      │ 품질 개선    │     │
│   └──────────┘      └──────────────┘      └──────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      대규모 마이그레이션                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐      ┌──────────────┐      ┌──────────────┐     │
│   │ /assess  │ ───▶ │   /migrate   │ ───▶ │    완료      │     │
│   │          │      │              │      │              │     │
│   │ 범위 파악 │      │ 점진적 전환  │      │ 시스템 현대화│     │
│   └──────────┘      └──────────────┘      └──────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## /assess

코드베이스의 품질을 평가하고 리팩토링 기회를 식별합니다.

### 사용법

```bash
/assess              # 현재 디렉토리 평가
/assess src/         # 특정 경로 평가
/assess --deep       # Opus로 심층 분석
```

### 옵션

| 옵션 | 설명 |
|------|------|
| `--deep` | Opus 에이전트로 심층 분석 |
| `--path=X` | 특정 디렉토리 분석 |
| `--format=json` | JSON 형식으로 출력 |

### 출력

```markdown
# Codebase Assessment Report

## Summary
- Overall health: [Good/Fair/Poor/Critical]
- Files analyzed: N
- Total issues: M

## Complexity Hotspots
[복잡도가 높은 파일 순위]

## Code Smells
[심각도별 코드 스멜 목록]

## Recommendations
[우선순위가 지정된 권장 사항]
```

### 에이전트

- `declutter-smell-detector` (Haiku): 패턴 기반 스멜 탐지
- `declutter-analyzer` (Sonnet): 구조 분석
- `declutter-analyzer-high` (Opus): 심층 분석 (`--deep`)

---

## /declutter

레거시 코드를 안전하게 리팩토링하는 전체 워크플로우를 시작합니다.

### 사용법

```bash
/declutter                    # 대화형 모드
/declutter src/module.py      # 특정 파일 대상
/declutter --from-assessment  # 이전 평가 이어서
```

### 옵션

| 옵션 | 설명 |
|------|------|
| `--from-assessment` | 평가 건너뛰고 기존 평가 사용 |
| `--target=X` | 특정 파일/모듈에 집중 |
| `--dry-run` | 계획만 생성, 실행 안 함 |
| `--high` | 전체 과정에서 Opus 사용 |

### 5단계 워크플로우

```
Phase 1: Assessment (평가)
├── 스멜 탐지
├── 복잡도 분석
└── 리포트 생성

Phase 2: Planning (계획)
├── 작업 목록 생성
├── 우선순위 지정
└── 사용자 승인

Phase 3: Test Harness (테스트 하네스)
├── 특성화 테스트 작성
├── 테스트 실행
└── 커버리지 확인

Phase 4: Refactoring (리팩토링)
├── 원자적 변경 적용
├── 각 변경 후 테스트
└── 테스트 통과 시 커밋

Phase 5: Verification (검증)
├── 전체 테스트 실행
├── 스멜 스캔
└── 동작 보존 확인
```

### 에이전트

| 단계 | 에이전트 | 모델 |
|------|----------|------|
| 평가 | declutter-analyzer | Sonnet |
| 스멜 탐지 | declutter-smell-detector | Haiku |
| 실행 | declutter-executor | Sonnet |
| 복잡한 실행 | declutter-executor-high | Opus |
| 검증 | declutter-reviewer | Opus |

### 안전 기능

- **원자적 커밋**: 각 변경이 별도로 커밋됨
- **테스트 검증**: 모든 변경 후 테스트 실행
- **롤백 준비**: 문제 발생 시 쉬운 되돌리기
- **진행 추적**: TodoWrite로 현재 상태 표시

---

## /migrate

점진적 마이그레이션 워크플로우로 레거시 시스템을 현대화합니다.

### 사용법

```bash
/migrate                          # 대화형 모드
/migrate strangler                # Strangler Fig 패턴
/migrate branch-by-abstraction    # Branch by Abstraction
/migrate --language=python        # Python 마이그레이션
/migrate --framework=react        # React 마이그레이션
```

### 옵션

| 옵션 | 설명 |
|------|------|
| `--strategy=X` | strangler, branch-by-abstraction |
| `--language=X` | python, typescript, java |
| `--framework=X` | react, vue, angular |
| `--scope=X` | 마이그레이션 범위 제한 |
| `--dry-run` | 계획만 생성 |

### 마이그레이션 전략

#### Strangler Fig Pattern

레거시 시스템을 점진적으로 교체:

```
Client ─▶ Router ─┬─▶ Legacy (90%)
                  └─▶ Modern (10%)
```

1. 새 구현을 레거시와 함께 생성
2. 트래픽을 점진적으로 새 시스템으로 라우팅
3. 완전 마이그레이션 후 레거시 제거

#### Branch by Abstraction

추상화 뒤에서 구현 교체:

```
Client ─▶ Interface ─┬─▶ Legacy (before)
                     └─▶ Modern (after)
```

1. 추상화 레이어 생성
2. 레거시 코드로 추상화 구현
3. 새 구현 생성
4. 새 구현으로 전환
5. 레거시 제거

### 언어별 마이그레이션

| 언어/프레임워크 | 마이그레이션 내용 |
|----------------|------------------|
| Python | Python 2→3, 타입 힌트, async/await |
| TypeScript | strict mode, 타입 추가 |
| React | 클래스→훅, PropTypes→TypeScript |

---

## 어떤 명령어를 사용해야 할까?

### /assess 사용

- 코드베이스 상태를 파악하고 싶을 때
- 리팩토링 우선순위를 정하고 싶을 때
- 품질 리포트가 필요할 때

### /declutter 사용

- 특정 모듈을 정리하고 싶을 때
- 코드 스멜을 제거하고 싶을 때
- 안전한 리팩토링이 필요할 때

### /migrate 사용

- 전체 시스템을 현대화하고 싶을 때
- 프레임워크나 언어 버전을 업그레이드할 때
- 점진적이고 안전한 전환이 필요할 때

---

## 공통 원칙

모든 명령어는 [Iron Laws](../concepts/iron-laws.md)를 따릅니다:

1. **평가 없이 리팩토링 금지**
2. **테스트 없이 코드 변경 금지**
3. **검증 없이 완료 선언 금지**

---

## 다음 단계

- [퀵스타트](../getting-started/quickstart.md) - 실제로 시작하기
- [Iron Laws](../concepts/iron-laws.md) - 핵심 원칙 이해하기
