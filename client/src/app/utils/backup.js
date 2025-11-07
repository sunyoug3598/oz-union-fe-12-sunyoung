// src/app/utils/backup.js
// 전역 데이터 백업/복원 유틸 (Zustand 스토어 기반 + 카테고리는 호출측에서 주입)

import { useSettings } from "../store/settingsStore";
import { useEvents } from "../store/eventsStore";
import { useRoutines } from "../store/routineStore";
import { useQuotes } from "../store/quotesStore";

// ---- 내보내기 ----
// categoriesSnap 은 호출부(예: MyPage)에서 useCategories().exportData()로 받아 넘겨주기
export function exportAll(categoriesSnap = null) {
  const settings = useSettings.getState();
  const events = useEvents.getState().events;
  const routines = useRoutines.getState().routines;
  const { quotes, mode } = useQuotes.getState();

  const payload = {
    meta: {
      app: "solan",
      version: 1,
      exportedAt: new Date().toISOString(),
    },
    settings,
    events,
    routines,
    quotes: { quotes, mode },
    ...(categoriesSnap ? { categories: categoriesSnap.categories } : {}),
  };
  return payload;
}

// 파일 다운로드(브라우저)
export function downloadJSON(filename, dataObj) {
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "solan-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- 불러오기 ----
// categoriesApplyFn 은 호출부(예: MyPage)에서 useCategories().importData 로 전달
export function importAll(payload, categoriesApplyFn = null) {
  if (!payload || typeof payload !== "object") {
    throw new Error("잘못된 백업 파일입니다.");
  }

  // settings
  if (payload.settings) {
    useSettings.setState({ ...useSettings.getState(), ...payload.settings });
  }

  // events
  if (payload.events && typeof payload.events === "object") {
    // 스토어에 준비된 importData 사용 (이미 저장까지 처리)
    const imp = useEvents.getState().importData;
    if (typeof imp === "function") {
      imp({ events: payload.events });
    } else {
      useEvents.setState({ events: payload.events });
    }
  }

  // routines
  if (Array.isArray(payload.routines)) {
    useRoutines.setState({ routines: payload.routines });
    try {
      localStorage.setItem("solan.routines.v1", JSON.stringify(payload.routines));
    } catch {}
  }

  // quotes
  if (payload.quotes && Array.isArray(payload.quotes.quotes)) {
    const { quotes, mode } = payload.quotes;
    useQuotes.setState({ quotes: quotes || [], mode: mode === "random" ? "random" : "sequential" });
    try {
      localStorage.setItem(
        "solan.quotes.v1",
        JSON.stringify({ quotes: quotes || [], mode: mode === "random" ? "random" : "sequential" })
      );
    } catch {}
  }

  // categories (컨텍스트라 util이 직접 접근 불가 → 호출부에서 주입)
  if (categoriesApplyFn && payload.categories) {
    categoriesApplyFn({ categories: payload.categories });
  }
}

// 파일 선택 후 JSON 파싱
export function openFileAndParseJSON() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return reject(new Error("파일이 선택되지 않았습니다."));
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          resolve(parsed);
        } catch (e) {
          reject(new Error("JSON 파싱에 실패했습니다."));
        }
      };
      reader.onerror = () => reject(reader.error || new Error("파일을 읽을 수 없습니다."));
      reader.readAsText(file);
    };
    input.click();
  });
}
