import { useEffect, useState } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import ScheduleCreateModal from "./ScheduleCreateModal";

/**
 * 전역에서 'open-new-schedule' 커스텀 이벤트를 받으면
 * ScheduleCreateModal을 띄워주는 컨트롤러.
 *
 * 예)
 * window.dispatchEvent(new CustomEvent("open-new-schedule", { detail: { day: 14 } }))
 */
export default function NewScheduleController() {
  const { addEvent } = useEvents();
  const [open, setOpen] = useState(false);
  const [defaultDay, setDefaultDay] = useState(null);

  useEffect(() => {
    const onOpen = (e) => {
      const day = e?.detail?.day ?? null;
      setDefaultDay(day);
      setOpen(true);
    };
    window.addEventListener("open-new-schedule", onOpen);
    return () => window.removeEventListener("open-new-schedule", onOpen);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setDefaultDay(null);
  };

  // ScheduleCreateModal onSubmit(data, dayNum)
  const handleSubmit = (data, dayNum) => {
    const id = data.id || `e-${Date.now()}`;
    addEvent(dayNum, {
      id,
      icon: data.icon,            // •/✕/→/－/○/★
      title: data.title,
      timeLabel: data.timeLabel,  // "시간 미정" 포함
      category: data.category,    // 개인/업무/건강/금융/기타
      repeat: data.repeat || null // monthly | null
    });
    handleClose();
  };

  return (
    <ScheduleCreateModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      defaultDay={defaultDay}
      initialEvent={null}
    />
  );
}
