// src/app/store/authStore.js
import { create } from "zustand";

const LS_AUTH = "solan.auth.v1";
const LS_USERS = "solan.users.v1";

// 유틸: 저장/불러오기
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

// 초기 사용자 목록(데모용)
const initialUsers = load(LS_USERS, [
  // { email: "test@example.com", nickname: "떠니", password: "12345678" }
]);

// 초기 로그인 상태
const initialAuth = load(LS_AUTH, {
  isLoggedIn: false,
  rememberMe: false,
  user: null, // { email, nickname }
});

export const useAuth = create((set, get) => ({
  isLoggedIn: initialAuth.isLoggedIn,
  rememberMe: initialAuth.rememberMe,
  user: initialAuth.user,
  users: initialUsers,

  // 회원가입
  signup: ({ email, nickname, password }) => {
    const users = get().users;
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("이미 가입된 이메일입니다.");

    const nextUsers = [...users, { email, nickname, password }]; // 데모이므로 평문저장
    set({ users: nextUsers });
    save(LS_USERS, nextUsers);
  },

  // 로그인
  login: ({ email, password, rememberMe }) => {
    const users = get().users;
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    const user = { email: found.email, nickname: found.nickname };
    const payload = { isLoggedIn: true, rememberMe: !!rememberMe, user };
    set(payload);
    if (rememberMe) save(LS_AUTH, payload);
    else save(LS_AUTH, { isLoggedIn: false, rememberMe: false, user: null });
  },

  // 자동로그인 유지: 앱 로드시 호출해도 됨(이미 초기값 로드 완료 상태)
  restore: () => {
    const st = load(LS_AUTH, initialAuth);
    if (st?.rememberMe && st?.isLoggedIn && st?.user) {
      set(st);
    }
  },

  // 로그아웃
  logout: () => {
    set({ isLoggedIn: false, user: null });
    // 자동로그인 해제
    save(LS_AUTH, { isLoggedIn: false, rememberMe: false, user: null });
  },
}));
