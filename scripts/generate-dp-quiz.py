#!/usr/bin/env python3
"""SW설계원칙과 디자인패턴 — 4지선다 단일 정답 JSON 생성 (기말 강의자료 범위)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "content" / "r2-seed" / "sets"
SUBJECT = "sw설계원칙과디자인패턴"

Question = dict[str, object]

SETS: list[dict[str, object]] = [
    {
        "slug": "dp-requirements-modeling",
        "title": "요구 모델링 (1-4)",
        "description": "모델링 기초, UML, 정·동·제어 모델링, 모델 검증",
        "questions": [
            {
                "id": "q1",
                "stem": "요구 모델링의 주된 목적로 자료에 제시된 것은?",
                "choices": [
                    "고객과 개발자가 무엇이 개발되는지에 동의하도록 요구 명세를 생성하는 것",
                    "구현 코드를 자동으로 생성하는 것",
                    "하드웨어 회로도를 작성하는 것",
                    "테스트 케이스만 작성하는 것",
                ],
                "correctIndex": 0,
                "explanation": "요구 모델링은 고객·개발자 간 합의와 시스템에 대한 형식·준형식적 설명 제공이 목적이다.",
            },
            {
                "id": "q2",
                "stem": "UML에 대한 설명으로 옳은 것은?",
                "choices": [
                    "객체지향 소프트웨어를 모델링하는 표준 그래픽 언어이다",
                    "관계형 데이터베이스 전용 쿼리 언어이다",
                    "웹 페이지 레이아웃만 표현하는 언어이다",
                    "운영체제 커널 설계 전용 표기법이다",
                ],
                "correctIndex": 0,
                "explanation": "UML은 시스템의 여러 측면을 그림으로 모델링하는 공통 언어이다.",
            },
            {
                "id": "q3",
                "stem": "자료에서 ‘구조 다이어그램’의 대표와 핵심 질문으로 짝지어진 것은?",
                "choices": [
                    "클래스 다이어그램 — ‘어떻게 생겼나’",
                    "유스케이스 다이어그램 — ‘누가 누구에게 요청?’",
                    "시퀀스 다이어그램 — ‘무엇을 하나’",
                    "액티비티 다이어그램 — ‘언제 통신하나’",
                ],
                "correctIndex": 0,
                "explanation": "구조(정적)는 클래스 다이어gram, 동작은 유스케이스, 인터랙션은 시퀀스가 대표이다.",
            },
            {
                "id": "q4",
                "stem": "정적 모델링에 대한 설명으로 맞는 것은?",
                "choices": [
                    "객체들의 공통 구조와 동작을 추상화한 것이며 클래스 다이어그램이 대표적이다",
                    "실행 중 시간에 따라 변하는 상호작용만 표현한다",
                    "액티비티 간 제어 흐름만 다룬다",
                    "프로토타입 실행 결과만 기록한다",
                ],
                "correctIndex": 0,
                "explanation": "정적 모델은 구조·클래스 관계를, 동적 모델은 실행 시 변화를 다룬다.",
            },
            {
                "id": "q5",
                "stem": "캡슐화(encapsulation)의 의미는?",
                "choices": [
                    "객체의 속성과 오퍼레이션을 하나로 묶고 정보 은닉을 적용하는 것",
                    "모든 메서드를 public으로 공개하는 것",
                    "상속 계층을 제거하는 것",
                    "객체를 파일로 직렬화하는 것",
                ],
                "correctIndex": 0,
                "explanation": "캡슐화는 속성·연산의 단위화와 정보 은닉을 포함한다.",
            },
            {
                "id": "q6",
                "stem": "시퀀스 다이어그램 작성 과정의 순서로 자료에 맞는 것은?",
                "choices": [
                    "참여 객체 파악 → X축에 객체·라이프라인 → 이벤트 순서대로 메시지 화살표",
                    "클래스 관계만 먼저 그린 뒤 상태 전이를 작성",
                    "액티비티 분기만 작성하고 객체는 생략",
                    "배치 다이어그램을 먼저 완성",
                ],
                "correctIndex": 0,
                "explanation": "Step 1~3: 객체 파악, 라이프라인, 사용 사례 이벤트 순 메시지 표현.",
            },
            {
                "id": "q7",
                "stem": "액티비티 다이어그램에서 ‘전환(transition)’이 의미하는 것은?",
                "choices": [
                    "액티비티에서 다른 액티비티로 제어가 넘어가는 것",
                    "클래스 간 상속 관계",
                    "객체 생성 메시지",
                    "패키지 import",
                ],
                "correctIndex": 0,
                "explanation": "액티비티 다이어그램은 액티비티·전환·분기로 제어 흐름을 표현한다.",
            },
            {
                "id": "q8",
                "stem": "모델 일관성 검증 예시로 자료에 나온 것은?",
                "choices": [
                    "클래스 다이어그램의 method1()만 있는데 상태 다이어그램에서 method2()를 사용하면 불일치",
                    "유스케이스 이름과 변수명이 같으면 불일치",
                    "시퀀스 다이어그램에 객체가 2개면 불일치",
                    "주석이 없으면 불일치",
                ],
                "correctIndex": 0,
                "explanation": "다이어그램 간 클래스·메시지·메서드 표현이 맞는지 cross-check한다.",
            },
        ],
    },
    {
        "slug": "dp-patterns-intro",
        "title": "디자인 패턴 이해 (2-4)",
        "description": "패턴 구조, GoF, UML 협력·순차 다이어그램",
        "questions": [
            {
                "id": "q1",
                "stem": "디자인 패턴의 세 요소로 자료에 제시된 것은?",
                "choices": [
                    "콘텍스트, 문제, 해결",
                    "클래스, 객체, 메시지",
                    "요구, 설계, 구현",
                    "분석, 코딩, 배포",
                ],
                "correctIndex": 0,
                "explanation": "패턴은 적용 상황(콘텍스트), 해결할 이슈(문제), 구조적 해결(해결)로 기술한다.",
            },
            {
                "id": "q2",
                "stem": "GoF(Gang of Four) 디자인 패턴 분류가 아닌 것은?",
                "choices": [
                    "통신 패턴",
                    "생성 패턴",
                    "구조 패턴",
                    "행위 패턴",
                ],
                "correctIndex": 0,
                "explanation": "GoF는 생성·구조·행위 패턴으로 분류한다.",
            },
            {
                "id": "q3",
                "stem": "‘Don’t reinvent the wheel’가 강조하는 바는?",
                "choices": [
                    "이미 검증된 해결책이 있으면 처음부터 다시 만들지 말 것",
                    "모든 코드를 매번 새로 작성할 것",
                    "패턴을 사용하지 말 것",
                    "UML 없이 코딩할 것",
                ],
                "correctIndex": 0,
                "explanation": "반복되는 문제에는 재사용 가능한 패턴적 해결책을 활용한다.",
            },
            {
                "id": "q4",
                "stem": "컬레보레이션(Collaboration)의 의미는?",
                "choices": [
                    "여러 객체가 협력해 하나의 기능·목적을 수행하는 구조",
                    "단일 객체의 private 필드 목록",
                    "데이터베이스 정규화 규칙",
                    "CPU 스레드 스케줄링",
                ],
                "correctIndex": 0,
                "explanation": "협력은 역할들의 상호작용을 추상화한 것이다.",
            },
            {
                "id": "q5",
                "stem": "순차 다이어그램에서 loop 프레임의 목적은?",
                "choices": [
                    "특정 조건이 참인 동안 메시지 흐름을 반복 표현",
                    "조건에 따라 서로 다른 흐름 중 하나만 선택",
                    "객체를 삭제",
                    "클래스 상속 표현",
                ],
                "correctIndex": 0,
                "explanation": "loop는 반복, alt는 조건 분기를 표현한다.",
            },
            {
                "id": "q6",
                "stem": "순차 다이어그램에서 alt 프레임의 목적은?",
                "choices": [
                    "조건에 따라 상호작용 흐름을 선택적으로 수행",
                    "무한 반복만 표현",
                    "객체 생성만 표현",
                    "패키지 의존성 표현",
                ],
                "correctIndex": 0,
                "explanation": "alt는 if~else처럼 조건별 분기 흐름을 나타낸다.",
            },
            {
                "id": "q7",
                "stem": "순차 다이어그램 표기 ‘Object1 : X’의 의미는?",
                "choices": [
                    "Object1이라는 이름의 X 클래스 인스턴스",
                    "X 패키지의 Object1 파일",
                    "Object1과 X가 상속 관계",
                    "Object1이 X보다 먼저 소멸",
                ],
                "correctIndex": 0,
                "explanation": "객체 이름과 클래스 이름을 함께 쓰는 표기법이다.",
            },
            {
                "id": "q8",
                "stem": "디자인 패턴의 ‘해결(Solution)’에 대한 설명으로 맞는 것은?",
                "choices": [
                    "특정 언어·구현에 의존하지 않는 일반화된 템플릿",
                    "항상 Java 소스 코드 한 벌",
                    "데이터베이스 스키마 DDL",
                    "하드웨어 핀 배치도",
                ],
                "correctIndex": 0,
                "explanation": "해결은 요소·관계·책임을 기술하되 구체적 구현에 묶이지 않는다.",
            },
        ],
    },
    {
        "slug": "dp-strategy",
        "title": "스트래티지 패턴",
        "description": "로봇 예제, 전략 분리, OCP",
        "questions": [
            {
                "id": "q1",
                "stem": "스트래티지 패턴을 적용하기 전 로봇 설계의 핵심 문제는?",
                "choices": [
                    "변하는 공격·이동 기능이 Robot 클래스 내부에 고정되어 변경 시 클래스를 직접 수정해야 함",
                    "로봇 객체를 하나도 만들 수 없음",
                    "인터페이스를 사용할 수 없음",
                    "UML을 그릴 수 없음",
                ],
                "correctIndex": 0,
                "explanation": "기능 변경마다 Robot 등 기존 클래스 수정·중복이 발생한다.",
            },
            {
                "id": "q2",
                "stem": "스트래티지 패턴의 해결 아이디어는?",
                "choices": [
                    "공격·이동 등 변하는 기능을 전략 객체로 캡슐화하고 Robot은 전략에 위임",
                    "모든 로봇을 하나의 클래스로 합침",
                    "attack()과 move()를 삭제",
                    "전략 클래스를 private inner class로만 둠",
                ],
                "correctIndex": 0,
                "explanation": "변하는 알고리즘을 Strategy로 분리하고 Context가 위임한다.",
            },
            {
                "id": "q3",
                "stem": "Robot.attack()이 호출될 때 실제 동작은?",
                "choices": [
                    "설정된 attackStrategy.attack()에 위임",
                    "항상 PunchStrategy만 실행",
                    "Robot 클래스 내부 if-else만 실행",
                    "아무 동작도 하지 않음",
                ],
                "correctIndex": 0,
                "explanation": "setAttackStrategy()로 주입한 전략 객체에게 실행을 맡긴다.",
            },
            {
                "id": "q4",
                "stem": "자료의 선가드(Sungard) 로봇 조합으로 맞는 것은?",
                "choices": [
                    "MissileStrategy + FlyingStrategy",
                    "PunchStrategy + WalkingStrategy",
                    "PunchStrategy + FlyingStrategy",
                    "MissileStrategy + WalkingStrategy",
                ],
                "correctIndex": 0,
                "explanation": "선가드는 미사일 공격·날아서 이동 전략을 사용한다.",
            },
            {
                "id": "q5",
                "stem": "스트래티지 패턴에서 Context의 역할은?",
                "choices": [
                    "Strategy 인터페이스를 참조해 알고리즘 실행을 위임",
                    "모든 ConcreteStrategy를 상속",
                    "전략 객체를 생성하지 않고 static만 사용",
                    "데이터베이스 연결만 관리",
                ],
                "correctIndex": 0,
                "explanation": "Context는 Strategy에 의존하고 구체 구현은 몰라도 된다.",
            },
            {
                "id": "q6",
                "stem": "스트래티지 패턴의 장점으로 자료에 나온 것은?",
                "choices": [
                    "기능 교체가 쉽고 중복을 줄이며 OCP에 적합",
                    "클래스 수가 줄어든다",
                    "전략 선택이 필요 없어진다",
                    "단순 기능에도 항상 필수",
                ],
                "correctIndex": 0,
                "explanation": "새 전략 추가 시 Context 변경을 최소화한다.",
            },
            {
                "id": "q7",
                "stem": "스트래티지 패턴 정의에 가장 가까운 것은?",
                "choices": [
                    "목적 달성 방식(알고리즘·규칙)을 쉽게 바꿀 수 있게 하는 패턴",
                    "객체를 프로그램 전체에서 하나만 생성하는 패턴",
                    "요청을 큐에 저장하는 패턴",
                    "상태별 클래스로 전환만 하는 패턴",
                ],
                "correctIndex": 0,
                "explanation": "전략은 수행 방식·알고리즘을 런타임에 교체 가능하게 한다.",
            },
            {
                "id": "q8",
                "stem": "실행 중 태권V의 공격 방식을 펀치→미사일로 바꿀 때 필요한 작업은?",
                "choices": [
                    "setAttackStrategy(new MissileStrategy())로 전략 객체만 교체",
                    "Robot 클래스의 attack() 메서드 본문 전체 수정",
                    "TaekwonV 클래스 삭제 후 재작성",
                    "MovingStrategy만 변경",
                ],
                "correctIndex": 0,
                "explanation": "Robot 코드는 유지하고 바뀌는 전략 객체만 교체한다.",
            },
        ],
    },
    {
        "slug": "dp-singleton",
        "title": "싱글톤 패턴",
        "description": "단일 인스턴스, lazy initialization",
        "questions": [
            {
                "id": "q1",
                "stem": "싱글톤 패턴의 목적은?",
                "choices": [
                    "프로그램 전체에서 객체를 하나만 생성하고 공유",
                    "객체를 가능한 많이 생성",
                    "모든 클래스를 abstract로 만듦",
                    "상속 깊이를 최대화",
                ],
                "correctIndex": 0,
                "explanation": "유일한 인스턴스를 통제·공유한다.",
            },
            {
                "id": "q2",
                "stem": "싱글톤 구현 요소로 자료에 맞는 조합은?",
                "choices": [
                    "private 생성자 + static instance + getInstance()",
                    "public 생성자 3개 + clone()",
                    "interface만 선언",
                    "final 클래스 + public 생성자",
                ],
                "correctIndex": 0,
                "explanation": "외부 new를 막고 하나의 접근 통로를 둔다.",
            },
            {
                "id": "q3",
                "stem": "PrinterManager를 싱글톤 적용 전 p1, p2로 각각 print()할 때 문제는?",
                "choices": [
                    "서로 다른 객체라 count가 따로 관리되어 전체 출력 횟수가 일관되지 않음",
                    "컴파일 오류 발생",
                    "print()가 두 번만 호출 가능",
                    "static 메서드를 사용할 수 없음",
                ],
                "correctIndex": 0,
                "explanation": "p1·p2가 별도 객체면 count가 각각 1로 남는다.",
            },
            {
                "id": "q4",
                "stem": "Lazy Initialization 방식의 동작은?",
                "choices": [
                    "첫 getInstance() 호출 때 instance가 null이면 생성, 이후에는 기존 객체 반환",
                    "프로그램 시작 전에 항상 10개 생성",
                    "매 호출마다 새 객체 생성",
                    "instance를 외부에서 직접 new",
                ],
                "correctIndex": 0,
                "explanation": "s1 == s2가 true — 같은 객체 주소를 공유한다.",
            },
            {
                "id": "q5",
                "stem": "싱글톤 UML에서 ‘-’ 기호의 의미는?",
                "choices": [
                    "private — 외부 접근·생성 차단",
                    "protected 상속",
                    "public 메서드",
                    "static 필드가 아님",
                ],
                "correctIndex": 0,
                "explanation": "UML에서 -는 private, +는 public, 밑줄/static 표기와 함께 쓴다.",
            },
            {
                "id": "q6",
                "stem": "싱글톤에 적합한 사용 예로 자료에 나온 것은?",
                "choices": [
                    "환경설정 관리자, 로그 관리자, 프린터 관리자",
                    "매번 새로운 사용자 세션 객체",
                    "요청마다 다른 DTO",
                    "테스트용 mock만",
                ],
                "correctIndex": 0,
                "explanation": "전역적으로 하나만 있어야 하는 공통 자원에 적합하다.",
            },
            {
                "id": "q7",
                "stem": "싱글톤의 주의점으로 자료에 나온 것은?",
                "choices": [
                    "전역 변수처럼 남용될 수 있고 멀티스레드에서는 동기화 고려 필요",
                    "객체가 절대 공유되지 않음",
                    "테스트가 항상 쉬움",
                    "생성자를 public으로 두어야 함",
                ],
                "correctIndex": 0,
                "explanation": "편리하지만 남용·테스트 어려움·동기화 이슈가 있다.",
            },
            {
                "id": "q8",
                "stem": "자료의 synchronized getInstance()가 다루는 문제는?",
                "choices": [
                    "멀티스레드 환경에서 instance가 중복 생성되는 것 방지",
                    "파일 입출력 속도",
                    "GUI 렌더링",
                    "네트워크 패킷 순서",
                ],
                "correctIndex": 0,
                "explanation": "동시에 null 체크·생성할 때 race condition을 막는다.",
            },
        ],
    },
    {
        "slug": "dp-state",
        "title": "스테이트 패턴",
        "description": "선풍기·형광등, 상태 캡슐화",
        "questions": [
            {
                "id": "q1",
                "stem": "선풍기 상태 머신에서 프로그램 시작 후 처음 진입하는 상태는?",
                "choices": ["OFF", "ON", "WORKING", "Active"],
                "correctIndex": 0,
                "explanation": "시작점(검은 원)에서 OFF로 진입한다.",
            },
            {
                "id": "q2",
                "stem": "복합 상태(Composite state) Active 안에서 switch_off 이벤트의 결과는?",
                "choices": [
                    "ON이든 WORKING이든 OFF로 전이",
                    "항상 ON만 유지",
                    "WORKING에서만 OFF",
                    "상태 변화 없음",
                ],
                "correctIndex": 0,
                "explanation": "복합 상태는 공통 전이로 상태 머신 복잡성을 줄인다.",
            },
            {
                "id": "q3",
                "stem": "FanBefore(조건문 방식)의 문제점은?",
                "choices": [
                    "상태 판단 if가 메서드마다 반복되고 상태 추가 시 FanBefore 전체 수정 필요",
                    "상태가 1개뿐이라 확장이 쉬움",
                    "setState를 사용해 전이가 명확함",
                    "상태별 클래스로 분리되어 있음",
                ],
                "correctIndex": 0,
                "explanation": "상태 로직이 Context에 집중·중복된다.",
            },
            {
                "id": "q4",
                "stem": "State 패턴 적용 후 Fan.switchOn()의 동작은?",
                "choices": [
                    "현재 state 객체의 switchOn()에 위임",
                    "Fan 클래스 내부 if (state==='OFF')만 실행",
                    "항상 WorkingState로만 전이",
                    "상태 객체를 null로 만듦",
                ],
                "correctIndex": 0,
                "explanation": "Fan은 현재 State에 위임하고 전이는 setState로 처리한다.",
            },
            {
                "id": "q5",
                "stem": "형광등에 ‘취침등(SLEEPING)’ 상태를 if-else로 추가할 때 문제는?",
                "choices": [
                    "상태 변화가 복잡한 조건문에 숨고 모든 메서드를 수정해야 함",
                    "상태가 2개로 줄어듦",
                    "인터페이스가 필요 없어짐",
                    "on/off 버튼이 사라짐",
                ],
                "correctIndex": 0,
                "explanation": "자료 7.3: 복잡한 조건문에 상태 변화가 숨는다.",
            },
            {
                "id": "q6",
                "stem": "State 패턴의 해결책은?",
                "choices": [
                    "상태를 캡슐화해 상태별 클래스로 행동·전이를 분리",
                    "모든 상태를 int 상수 하나로만 관리",
                    "Light 클래스에 switch문만 추가",
                    "상태 전이를 제거",
                ],
                "correctIndex": 0,
                "explanation": "7.4: 상태를 캡슐화한다.",
            },
            {
                "id": "q7",
                "stem": "OffState.switchOn() 실행 후 Fan의 상태는?",
                "choices": [
                    "OnState",
                    "WorkingState",
                    "OffState 유지",
                    "SLEEPING",
                ],
                "correctIndex": 0,
                "explanation": "OFF에서 switchOn → ON으로 전이한다.",
            },
            {
                "id": "q8",
                "stem": "WorkingState에서 switchOff()의 결과는?",
                "choices": [
                    "OffState로 전이",
                    "OnState로만 전이",
                    "WorkingState 유지",
                    "Active만 종료",
                ],
                "correctIndex": 0,
                "explanation": "WORKING·ON 모두 switch_off 시 OFF로 갈 수 있다.",
            },
        ],
    },
    {
        "slug": "dp-command",
        "title": "커맨드 패턴",
        "description": "만능 버튼, 요청 캡슐화, Undo/Redo",
        "questions": [
            {
                "id": "q1",
                "stem": "커맨드 패턴의 정의로 맞는 것은?",
                "choices": [
                    "요청을 객체로 캡슐화해 실행·취소·재실행을 관리하기 쉽게 함",
                    "모든 메서드를 static으로 만듦",
                    "상속만으로 기능 확장",
                    "데이터베이스 트랜잭션 롤백 전용",
                ],
                "correctIndex": 0,
                "explanation": "해야 할 일을 요청 객체로 만들어 관리한다.",
            },
            {
                "id": "q2",
                "stem": "초기 Button(Lamp) 설계에서 알람으로 바꾸려 할 때 문제는?",
                "choices": [
                    "Button.pressed()와 Button 필드를 수정해야 해 OCP 위반",
                    "Lamp 클래스만 수정하면 됨",
                    "Command 인터페이스가 이미 있음",
                    "컴파일러가 자동 교체",
                ],
                "correctIndex": 0,
                "explanation": "8.2.1: Button 클래스 pressed 수정 필요 → OCP 위반.",
            },
            {
                "id": "q3",
                "stem": "Mode(LAMP, ALARM)로 버튼 동작을 바꾸는 방식의 문제는?",
                "choices": [
                    "기능 추가·변경마다 Button 클래스를 수정해야 함",
                    "setMode를 쓸 수 없음",
                    "Lamp와 Alarm을 동시에 켤 수 없음",
                    "enum을 사용할 수 없음",
                ],
                "correctIndex": 0,
                "explanation": "8.2.2: 기능 변경 시 Button 수정 → OCP 위반.",
            },
            {
                "id": "q4",
                "stem": "커맨드 패턴 해결책의 핵심은?",
                "choices": [
                    "수행할 기능을 Command 객체로 캡슐화해 Button에 전달",
                    "Button이 Lamp·Alarm을 직접 상속",
                    "pressed()에서 switch-case만 확장",
                    "Client가 Lamp.turnOn()만 호출",
                ],
                "correctIndex": 0,
                "explanation": "버튼은 Command.execute()만 호출한다.",
            },
            {
                "id": "q5",
                "stem": "LampOnCommand.execute()가 하는 일은?",
                "choices": [
                    "theLamp.turnOn() 호출",
                    "Alarm.start() 호출",
                    "Button.pressed() 재귀 호출",
                    "Mode를 LAMP로 설정",
                ],
                "correctIndex": 0,
                "explanation": "Concrete Command가 Receiver(Lamp) 기능을 호출한다.",
            },
            {
                "id": "q6",
                "stem": "Button.pressed() (커맨드 적용 후)의 동작은?",
                "choices": [
                    "theCommand.execute() 호출",
                    "theLamp.turnOn() 직접 호출",
                    "Mode에 따라 switch",
                    "아무 동작 없음",
                ],
                "correctIndex": 0,
                "explanation": "버튼은 구체 기능을 모르고 Command에 위임한다.",
            },
            {
                "id": "q7",
                "stem": "button2.setCommand(lampOnCommand) 후 pressed()의 결과는?",
                "choices": [
                    "Lamp On 출력",
                    "Alarming... 출력",
                    "컴파일 오류",
                    "Mode만 변경",
                ],
                "correctIndex": 0,
                "explanation": "Client 예제: button2에 lampOnCommand 설정 후 램프 켜기.",
            },
            {
                "id": "q8",
                "stem": "리모컨 ‘전등 켜기’를 커맨드로 두었을 때 취소(Undo)에 해당하는 것은?",
                "choices": [
                    "전등 끄기",
                    "전등 켜기 재실행",
                    "채널 변경",
                    "볼륨만 조절",
                ],
                "correctIndex": 0,
                "explanation": "요청을 객체로 저장하면 실행·취소·재실행을 관리하기 쉽다.",
            },
        ],
    },
]


def load_existing_index() -> list[dict]:
    index_path = ROOT / "content" / "r2-seed" / "index.json"
    if not index_path.exists():
        return []
    return json.loads(index_path.read_text(encoding="utf-8"))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    new_entries: list[dict] = []

    for meta in SETS:
        data = {
            "slug": meta["slug"],
            "title": meta["title"],
            "subject": SUBJECT,
            "description": meta["description"],
            "questions": meta["questions"],
        }
        out_path = OUT_DIR / f"{meta['slug']}.json"
        out_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        new_entries.append(
            {
                "slug": meta["slug"],
                "title": meta["title"],
                "subject": SUBJECT,
                "description": meta["description"],
                "questionCount": len(meta["questions"]),  # type: ignore[arg-type]
            }
        )
        print(f"{meta['slug']}: {len(meta['questions'])} questions")  # type: ignore[arg-type]

    existing = load_existing_index()
    by_slug = {e["slug"]: e for e in existing}
    for e in new_entries:
        by_slug[e["slug"]] = e
    merged = sorted(by_slug.values(), key=lambda x: x["slug"])

    index_path = ROOT / "content" / "r2-seed" / "index.json"
    index_path.write_text(
        json.dumps(merged, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"index.json: {len(merged)} sets total")


if __name__ == "__main__":
    main()
