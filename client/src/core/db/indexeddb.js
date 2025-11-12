export const db = {
  open: async () => Promise.resolve(true),
  get: async () => null,
  set: async () => true,
  list: async () => [],
  remove: async () => true,
};
