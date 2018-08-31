export const filterObj = (obj, filter) => {
  const filtered = {};
  Object.keys(obj)
    .filter(k => filter(k, obj[k]))
    .forEach(k => (filtered[k] = obj[k]));
  return filtered;
};

export const mapObj = (obj, mapper) => {
  const mapped = {};
  Object.keys(obj).forEach(k => {
    mapped[k] = mapper(k, obj[k]);
  });
  return mapped;
};
