// src/app/utils/io.js
export function downloadJSON(obj, filename = "solan-backup.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function openJSONFile() {
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
          const data = JSON.parse(reader.result);
          resolve(data);
        } catch (e) {
          reject(new Error("JSON 파싱 실패"));
        }
      };
      reader.onerror = () => reject(new Error("파일 읽기 실패"));
      reader.readAsText(file, "utf-8");
    };
    input.click();
  });
}
