import { db } from "../indexeddb";

// 카테고리 CRUD
export async function listCategories() {
  return db.categories.orderBy("createdAt").toArray();
}

export async function getCategoryById(id) {
  return db.categories.get(id);
}

export async function findCategoryByName(name) {
  return db.categories.where("name").equalsIgnoreCase(name).first();
}

export async function createCategory({ id, name, color }) {
  const exists = await findCategoryByName(name);
  if (exists) throw new Error("이미 존재하는 카테고리입니다.");
  const createdAt = Date.now();
  const _id = id ?? `cat-${createdAt}`;
  await db.categories.add({ id: _id, name, color, createdAt });
  return db.categories.get(_id);
}

export async function updateCategory(id, patch) {
  await db.categories.update(id, patch);
  return db.categories.get(id);
}

export async function deleteCategory(id) {
  // 보호 로직 필요하면 여기서 가드
  await db.categories.delete(id);
}
