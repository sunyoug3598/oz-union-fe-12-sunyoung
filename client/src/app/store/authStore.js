import { create } from "zustand";

const LS_USERS = "solan.auth.users.v1";
const LS_USER  = "solan.auth.user.v1";
const LS_LOCK  = "solan.auth.lock.v1"; // { email: { count, until } }

const load = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// 규칙: 닉네임(2~12자, 한글/영문/숫자), 비번(8~20자, 소문자+숫자 필수)
const NICK_RE = /^[A-Za-z0-9가-힣]{2,12}$/;
const PW_RE   = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+=]{8,20}$/;

export const useAuth = create((set, get) => ({
  users: load(LS_USERS, []),  // [{id,email,nickname,passwordHash}]
  user : load(LS_USER, null), // 로그인된 사용자
  locks: load(LS_LOCK, {}),   // { [email]: { count, until: epochMS } }

  // 해시 대용(데모): 실제 서비스는 절대 이렇게 하지 말 것
  _hash(pw) { return `#${pw}#`; },

  validateNickname(nick) { return NICK_RE.test((nick||"").trim()); },
  validatePassword(pw)   { return PW_RE.test((pw||"").trim()); },

  signup({ email, password, nickname }) {
    email = (email||"").trim().toLowerCase();
    nickname = (nickname||"").trim();

    if (!email || !password || !nickname) throw new Error("모든 필드를 입력해주세요.");
    if (!get().validateNickname(nickname)) throw new Error("닉네임 규칙을 확인해주세요. (2~12자, 한글/영문/숫자)");
    if (!get().validatePassword(password)) throw new Error("비밀번호 규칙을 확인해주세요. (8~20자, 소문자+숫자 필수)");

    const users = [...get().users];
    if (users.some(u => u.email === email)) throw new Error("이미 가입된 이메일입니다.");
    if (users.some(u => u.nickname === nickname)) throw new Error("이미 사용 중인 닉네임입니다.");

    const newUser = {
      id: `u_${Date.now()}`,
      email,
      nickname,
      passwordHash: get()._hash(password),
      createdAt: Date.now(),
    };
    users.push(newUser);
    save(LS_USERS, users);
    set({ users });

    // 가입 후 자동 로그인
    const user = { id: newUser.id, email, nickname };
    save(LS_USER, user);
    set({ user });

    return user;
  },

  login({ email, password, remember = true }) {
    email = (email||"").trim().toLowerCase();
    const { users, _hash } = get();

    // 잠금 로직(5회 실패 시 5분 잠금)
    const locks = { ...get().locks };
    const now = Date.now();
    const info = locks[email];
    if (info && info.until && now < info.until) {
      const left = Math.ceil((info.until - now) / 1000);
      throw new Error(`로그인 제한 중입니다. ${left}초 후 다시 시도하세요.`);
    }

    const found = users.find(u => u.email === email);
    if (!found || found.passwordHash !== _hash(password)) {
      const cur = locks[email] || { count: 0, until: 0 };
      cur.count += 1;
      if (cur.count >= 5) {
        cur.until = now + 5 * 60 * 1000; // 5분
        cur.count = 0;
      }
      locks[email] = cur;
      save(LS_LOCK, locks);
      set({ locks });
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 성공: 잠금 초기화
    if (locks[email]) {
      delete locks[email];
      save(LS_LOCK, locks);
      set({ locks });
    }

    const user = { id: found.id, email: found.email, nickname: found.nickname };
    if (remember) save(LS_USER, user);
    set({ user });
    return user;
  },

  logout() {
    save(LS_USER, null);
    set({ user: null });
  },
}));
