export const SCHEMA_VERSION = 1;

export const STORES = {
  users: "id,email,name",
  settings: "theme,upcomingRangeDays,showCompleted",
  categories: "id,name,color,createdAt",
  notes: "id,title,content,createdAt,updatedAt",
  schedules: "id,day,title,timeLabel,category,repeat,icon",
};
