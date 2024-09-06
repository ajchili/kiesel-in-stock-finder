export const capitalize = (str: string): string => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

export const formatFilterName = (name: string): string => {
  let formattedName = `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;
  return formattedName.replace(/[A-Z]/g, (word) => {
    return ` ${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
  });
};
