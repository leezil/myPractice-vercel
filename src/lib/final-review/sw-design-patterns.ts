import type { ReviewSet } from "./types";

/** SW설계원칙과 디자인패턴 — 기말 강의자료 6주제 키워드 정리 */
export const SW_DESIGN_PATTERNS_FINAL_REVIEW: ReviewSet[] = [
  {
    slug: "dp-requirements-modeling",
    title: "요구 모델링 (1-4)",
    description: "모델링 기초 · UML · 정·동·제어 모델링 · 모델 검증",
    concepts: [
      {
        name: "요구 모델링",
        keywords: [
          "고객·개발자 합의",
          "요구 명세 생성",
          "형식적·준형식적 시스템 설명",
        ],
      },
      {
        name: "모델링을 하는 이유 (7가지)",
        keywords: [
          "복잡함 관리",
          "구조 시각화",
          "커뮤니케이션",
          "도메인·요구 이해",
          "시스템 이해",
          "구현 전 실험",
          "기존 시스템 문서화",
        ],
      },
      {
        name: "관점 · 추상화",
        keywords: [
          "perspective(관점)",
          "abstraction level(추상화 수준)",
          "같은 시스템도 모델이 달라짐",
        ],
      },
      {
        name: "UML",
        keywords: [
          "객체지향 표준 그래픽 언어",
          "회로도처럼 여러 측면 표현",
          "OMT · Booch · OOSE 통합",
        ],
      },
      {
        name: "시스템 모델링 관점",
        keywords: ["기능적 관점", "구조적 관점", "동적 관점"],
      },
      {
        name: "대표 다이어그램",
        keywords: [
          "클래스 — 어떻게 생겼나(구조)",
          "유스케이스 — 무슨 일을 하나(동작)",
          "시퀀스 — 누가 누구에게 요청?(인터랙션)",
        ],
      },
      {
        name: "UML 모델링 과정",
        keywords: [
          "① 사용 사례·유스케이스 다이어그램",
          "② 클래스 후보·개념 객체 모형",
          "③ 순서(시퀀스) 다이어그램",
          "④ 속성·오퍼레이션·관계 완성",
          "⑤ 상태·액티비티 등 추가",
          "⑥ 서브시스템·전체 구조",
          "⑦ 객체 설계·커스터마이징",
        ],
      },
      {
        name: "OO 기본 개념",
        keywords: [
          "객체: 상태·동작·고유 식별자",
          "클래스: 공통 속성 집합의 정의",
          "캡슐화: 단위화 + 정보 은닉",
          "연관: 서비스 제공·요청 상호작용",
          "상속: 일반화 속성·연산 물려받기",
          "다형성: 같은 메시지, 다른 구현",
        ],
      },
      {
        name: "클래스 다이어그램 표기",
        keywords: [
          "이름 / 속성 / 오퍼레이션",
          "추상 클래스: 이탤릭체",
          "인터페이스: <<interface>>",
          "관계: 연관·상속·의존·구현",
        ],
      },
      {
        name: "동적 · 제어 모델링",
        keywords: [
          "동적: 실행 시 변하는 뷰, 상호작용 패턴",
          "시퀀스: 메시지 순서, 라이프라인",
          "협동: 객체 링크 + 메시지",
          "상태: 이벤트·응답에 따른 전이",
          "액티비티: 제어 흐름, 분기(진위 조건)",
        ],
      },
      {
        name: "모델 검증",
        keywords: [
          "리뷰(워크스루·인스펙션)",
          "테스팅",
          "정형적 방법",
          "프로토타이핑",
          "요구 추적",
          "다이어그램 간 일관성 확인",
        ],
      },
    ],
    people: [],
    events: [
      {
        name: "시퀀스 작성 Step",
        year: "Step",
        keywords: ["1 객체 파악", "2 X축·라이프라인", "3 메시지 화살표"],
      },
      {
        name: "클래스·시퀀스 일관성",
        year: "검증",
        keywords: [
          "클래스 다이어그램에 없는 메서드 호출 → 불일치",
          "유스케이스 ↔ 시퀀스 대응 확인",
        ],
      },
    ],
    keywords: [
      "요구 모델링",
      "UML",
      "클래스 다이어그램",
      "시퀀스",
      "상태",
      "액티비티",
      "캡슐화",
      "다형성",
      "모델 검증",
    ],
    takeaways: [
      "모델은 관점·추상화 수준에 따라 달라진다",
      "구조=클래스, 동작=유스케이스, 인터랙션=시퀀스",
      "정적 모델(구조)과 동적 모델(상호작용·상태)을 함께 본다",
    ],
  },
  {
    slug: "dp-patterns-intro",
    title: "디자인 패턴 이해 (2-4)",
    description: "패턴 구조 · GoF 분류 · UML 협력·순차 다이어그램",
    concepts: [
      {
        name: "디자인 패턴이란",
        keywords: [
          "반복되는 문제 + 핵심 해결책",
          "재사용 가능한 설계 템플릿",
          "Don't reinvent the wheel",
        ],
      },
      {
        name: "패턴 구조 3요소",
        keywords: [
          "콘텍스트: 적용 상황·제약",
          "문제: 해결할 디자인 이슈",
          "해결: 요소·관계·책임·협력(언어 독립)",
        ],
      },
      {
        name: "GoF 분류",
        keywords: [
          "생성(Creational): 객체 생성",
          "구조(Structural): 클래스 조합",
          "행위(Behavioral): 알고리즘·책임 분배",
        ],
      },
      {
        name: "GoF",
        keywords: [
          "Gang of Four (4명)",
          "1994 Design Patterns",
          "재사용 가능한 OO 디자인 체계화",
        ],
      },
      {
        name: "컬레보레이션",
        keywords: [
          "역할들의 상호작용 추상화",
          "목적 달성을 위한 객체 협력 구조",
          "구조적 측면: 누가 협력하는가",
          "행위적 측면: 어떻게 상호작용하는가",
        ],
      },
      {
        name: "컬레보레이션 어커런스",
        keywords: [
          "추상 협력 → 실제 객체 매핑",
          "점선 화살표: 역할↔객체 대응",
          "실선: 객체 간 연관",
          "*: 다중 관계 가능",
        ],
      },
      {
        name: "순차(시퀀스) 다이어그램",
        keywords: [
          "메시지 송신과 순서",
          "생명선(객체 아래 점선)",
          "<<create>> 생성 · <<destroy>> 소멸",
          "가드 [g]: 조건부 실행",
          "응답: 점선 화살표",
        ],
      },
      {
        name: "loop · alt 프레임",
        keywords: [
          "loop: 조건 참인 동안 반복 (while/for)",
          "alt: 조건에 따라 흐름 선택 (if~else)",
        ],
      },
    ],
    people: [
      {
        name: "크리스토퍼 알렉산더",
        role: "패턴 개념 제시",
        keywords: ["반복 문제", "핵심 해결책", "수백만 번 재사용"],
      },
      {
        name: "GoF 4인",
        role: "감마·헬름·존슨·블리시디시",
        years: "1994",
        keywords: ["Design Patterns", "생성·구조·행위"],
      },
    ],
    events: [
      {
        name: "생성 패턴 예",
        year: "생성",
        keywords: ["싱글톤", "객체 수·생성 통제"],
      },
      {
        name: "행위 패턴 예",
        year: "행위",
        keywords: ["스트래티지", "스테이트", "커맨드"],
      },
    ],
    keywords: [
      "콘텍스트",
      "문제",
      "해결",
      "GoF",
      "컬레보레이션",
      "loop",
      "alt",
      "시퀀스",
    ],
    takeaways: [
      "패턴 = 상황(콘텍스트) + 반복 문제 + 일반화된 해결",
      "UML 협력으로 패턴 구조·행위를 표현한다",
      "loop=반복, alt=분기 — 시험에 자주 나옴",
    ],
  },
  {
    slug: "dp-strategy",
    title: "스트래티지 패턴",
    description: "변하는 알고리즘 분리 · Context·Strategy · OCP",
    concepts: [
      {
        name: "문제 (로봇 예제)",
        keywords: [
          "공격·이동이 Robot 클래스에 고정",
          "기능 변경 시 클래스 직접 수정",
          "중복 코드·영향 범위 확대",
          "핵심: 변하는 기능이 Context 내부에 있음",
        ],
      },
      {
        name: "해결 아이디어",
        keywords: [
          "변하는 부분을 전략 객체로 캡슐화",
          "Context가 Strategy에 위임",
          "수정 중심 → 교체 중심",
        ],
      },
      {
        name: "역할",
        keywords: [
          "Context: Strategy 참조, 실행 위임",
          "Strategy: 알고리즘 인터페이스",
          "ConcreteStrategy: 구체 알고리즘",
          "Client: Context 생성·전략 선택·설정",
        ],
      },
      {
        name: "로봇 전략 조합",
        keywords: [
          "태권V: 펀치 + 걷기",
          "아톰: 펀치 + 날기",
          "선가드: 미사일 + 날기",
          "런타임 setStrategy로 교체 가능",
        ],
      },
      {
        name: "정의",
        keywords: [
          "목적 달성 방식·알고리즘·규칙을 쉽게 바꾸는 패턴",
          "게임 캐릭터 행동 교체에 유용",
        ],
      },
    ],
    people: [],
    events: [
      {
        name: "순차 다이어그램 흐름",
        year: "흐름",
        keywords: [
          "create Context·Strategy",
          "alt로 전략 선택",
          "setStrategy",
          "strategyMethod 호출",
        ],
      },
      {
        name: "대표 사용 예",
        year: "적용",
        keywords: ["결제 방식", "정렬 알고리즘", "로봇 공격·이동"],
      },
    ],
    keywords: [
      "Strategy",
      "Context",
      "OCP",
      "알고리즘 교체",
      "위임",
      "PunchStrategy",
      "MissileStrategy",
    ],
    takeaways: [
      "변하는 기능을 클래스로 분리해 전략 객체를 바꿔 끼운다",
      "장점: 교체 용이·중복 감소·OCP / 주의: 클래스 증가·전략 선택 관리",
      "Context는 구체 전략 구현을 몰라도 된다",
    ],
  },
  {
    slug: "dp-singleton",
    title: "싱글톤 패턴",
    description: "단일 인스턴스 · 생성 통제 · Lazy 초기화",
    concepts: [
      {
        name: "목적",
        keywords: [
          "프로그램 전체에서 객체 하나만 생성·공유",
          "DB 커넥션·설정·로그 등 유일 인스턴스",
        ],
      },
      {
        name: "문제",
        keywords: [
          "외부에서 new 자유 호출",
          "상태 불일치(출력 횟수 등)",
          "자원 낭비·관리 혼란",
        ],
      },
      {
        name: "구현 3요소",
        keywords: [
          "private 생성자 — 외부 new 차단",
          "static instance — 객체 1개 보관",
          "getInstance() — 유일한 접근 통로",
        ],
      },
      {
        name: "Lazy Initialization",
        keywords: [
          "첫 요청 시 instance == null이면 생성",
          "이후 같은 객체 반환 (s1 == s2)",
        ],
      },
      {
        name: "UML 표기",
        keywords: [
          "- : private",
          "+ : public",
          "static: 클래스 차원 공유",
        ],
      },
    ],
    people: [],
    events: [
      {
        name: "PrinterManager 사례",
        year: "사례",
        keywords: [
          "적용 전: p1·p2 각각 count=1",
          "적용 후: 공유 count 1→2, p1==p2",
        ],
      },
      {
        name: "적합·부적합",
        year: "판단",
        keywords: [
          "적합: 설정·로그·프린터·게임 매니저",
          "주의: 전역 변수화·테스트 어려움·동기화",
        ],
      },
    ],
    keywords: [
      "싱글톤",
      "getInstance",
      "private 생성자",
      "static instance",
      "Lazy",
      "유일 인스턴스",
    ],
    takeaways: [
      "하나만 있어야 하는 객체의 생성을 통제하고 모두가 공유한다",
      "생성은 막고, 접근은 하나의 통로로 제한",
      "멀티스레드 환경에서는 synchronized 등 동기화 고려",
    ],
  },
  {
    slug: "dp-state",
    title: "스테이트 패턴",
    description: "상태 캡슐화 · 선풍기 상태머신 · 형광등 문제",
    concepts: [
      {
        name: "문제 (조건문 방식)",
        keywords: [
          "상태 판단 if가 메서드마다 반복",
          "새 상태 추가 시 클래스 전체 수정",
          "공통 전이(switchOff) 중복",
          "형광등: int state + 복잡한 else-if",
        ],
      },
      {
        name: "해결",
        keywords: [
          "상태를 객체로 캡슐화",
          "Context(Fan/Light)는 현재 State만 참조",
          "전이는 setState(new XxxState())",
          "각 State가 자신의 전이만 담당",
        ],
      },
      {
        name: "선풍기 상태 (3가지)",
        keywords: [
          "OFF: 전원 꺼짐",
          "ON: 전원 켜짐, 대기",
          "WORKING: 실제 동작",
        ],
      },
      {
        name: "복합 상태 (Composite state)",
        keywords: [
          "Active = ON + WORKING 묶음",
          "Active 안에서 switch_off → OFF",
          "복합 상태 진입 시 묵시적 시작 상태(ON)",
          "공통 전이로 복잡성 감소",
        ],
      },
      {
        name: "역할",
        keywords: [
          "Context: 현재 상태 보유, 요청을 State에 위임",
          "State: 상태별 동작·전이 정의",
          "ConcreteState: OFF/ON/WORKING 등",
        ],
      },
    ],
    people: [],
    events: [
      {
        name: "선풍기 전이",
        year: "전이",
        keywords: [
          "OFF --switch_on--> ON",
          "ON --run--> WORKING",
          "WORKING --stop--> ON",
          "ON|WORKING --switch_off--> OFF",
        ],
      },
      {
        name: "형광등 상태",
        year: "사례",
        keywords: [
          "OFF / ON / SLEEPING(취침등)",
          "상태 추가 시 if-else 폭증 → State 패턴",
        ],
      },
    ],
    keywords: [
      "State",
      "상태 전이",
      "setState",
      "복합 상태",
      "선풍기",
      "형광등",
    ],
    takeaways: [
      "객체의 내부 상태가 바뀔 때 행동이 달라지면 스테이트 패턴",
      "if-else 상태 분기를 상태 클래스로 분리한다",
      "상태머신 다이어그램과 코드 구조를 연결해 암기",
    ],
  },
  {
    slug: "dp-command",
    title: "커맨드 패턴",
    description: "요청 객체화 · Invoker·Command·Receiver · OCP",
    concepts: [
      {
        name: "정의",
        keywords: [
          "요청(Request)을 객체로 캡슐화",
          "실행·취소(Undo)·재실행(Redo) 관리",
          "호출자와 수신자 분리",
        ],
      },
      {
        name: "문제 (만능 버튼)",
        keywords: [
          "Button이 Lamp/Alarm에 직접 의존",
          "기능 변경마다 Button 수정 → OCP 위반",
          "런타임에 동작 변경·추가 어려움",
        ],
      },
      {
        name: "해결",
        keywords: [
          "수행 기능을 Command 객체로 캡슐화",
          "Button은 Command만 알면 됨",
          "setCommand로 런타임 교체",
        ],
      },
      {
        name: "역할",
        keywords: [
          "Invoker(Button): pressed() → command.execute()",
          "Command: execute() 인터페이스",
          "ConcreteCommand: LampOnCommand, AlarmOnCommand",
          "Receiver(Lamp, Alarm): 실제 작업 수행",
          "Client: Command 생성·Button 연결",
        ],
      },
      {
        name: "리모컨 비유",
        keywords: [
          "실행: 전등 켜기",
          "취소: 전등 끄기",
          "재실행: 다시 켜기",
          "요청 객체에 명령 기록",
        ],
      },
    ],
    people: [],
    events: [
      {
        name: "적용 전",
        year: "Before",
        keywords: [
          "Button(Lamp) — pressed()에서 turnOn() 직접 호출",
          "Alarm 추가 시 Button 클래스 수정",
        ],
      },
      {
        name: "적용 후",
        year: "After",
        keywords: [
          "Button(Command)",
          "LampOnCommand / AlarmOnCommand",
          "button.setCommand()로 교체",
        ],
      },
    ],
    keywords: [
      "Command",
      "Invoker",
      "Receiver",
      "execute",
      "Undo",
      "OCP",
      "캡슐화",
    ],
    takeaways: [
      "해야 할 일을 요청 객체로 만들어 관리한다",
      "버튼(호출자)은 구체 기능을 몰라도 execute만 호출",
      "새 기능 = 새 Command 추가, Button 수정 최소화",
    ],
  },
];
