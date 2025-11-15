import { db } from "../indexeddb";

// 일정은 day(1~30) 필드 포함
export async function listSchedulesInMonth() {
  // 필요하면 month/year 추가 설계
  return db.schedules.toArray();
}

export async function listSchedulesByDay(day) {
  return db.schedules.where("day").equals(day).toArray();
}

export async function createSchedule(payload) {
  const id = payload.id ?? `sch-${Date.now()}`;
  await db.schedules.add({ ...payload, id });
  return db.schedules.get(id);
}

export async function updateSchedule(id, patch) {
  await db.schedules.update(id, patch);
  return db.schedules.get(id);
}

export async function deleteSchedule(id) {
  await db.schedules.delete(id);
}

// Upcoming: 오늘~N일 범위
export async function listUpcoming(days = 7) {
  const today = Math.min(30, Math.max(1, new Date().getDate()));
  const end = Math.min(30, today + days);
  const all = await db.schedules
    .filter((ev) => ev.day >= today && ev.day <= end)
    .toArray();
  return all.sort((a, b) => a.day - b.day);
}
