// Dexie 기반 IndexedDB 초기화
import Dexie from "dexie";
import { SCHEMA_VERSION, STORES } from "./schema";

export const db = new Dexie("solan-db");

// id를 keyPath로 사용 (자동증가 X, 직접 uuid/Date.now 사용 권장)
db.version(SCHEMA_VERSION).stores({
  users: STORES.users,
  settings: STORES.settings,
  categories: STORES.categories,
  notes: STORES.notes,
  schedules: STORES.schedules,
});

// 선택: 최초 1회 트랜잭션 유효성 체크
export async function pingDB() {
  await db.transaction("r", db.categories, async () => {});
}

// 선택: 시드가 필요 없으면 빈 함수로 둬도 됨
export async function seedIfEmpty() {
  const count = await db.categories.count();
  if (count > 0) return;
  // 완전 동적 시작을 원하면 아래 4줄도 주석 처리/삭제.
  const now = Date.now();
  await db.categories.bulkAdd([
    { id: "cat-personal", name: "개인일정", color: "#9ec5fe", createdAt: now },
    { id: "cat-work",     name: "업무",     color: "#5ea2ef", createdAt: now },
    { id: "cat-health",   name: "건강",     color: "#ffb08a", createdAt: now },
    { id: "cat-finance",  name: "금융",     color: "#f3d073", createdAt: now },
    { id: "cat-etc",      name: "기타",     color: "#c9ccd1", createdAt: now },
  ]);
}
