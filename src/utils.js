export const mapArray = (array, mapper) => {
  const mapped = {};
  array.forEach(k => {
    mapped[k] = mapper(k);
  });
  return mapped;
};

export const filterObj = (obj, filter) => {
  const filtered = {};
  Object.keys(obj)
    .filter(k => filter(k, obj[k]))
    .forEach(k => (filtered[k] = obj[k]));
  return filtered;
};

export const isObject = value =>
  value && typeof value === 'object' && value.constructor === Object;
