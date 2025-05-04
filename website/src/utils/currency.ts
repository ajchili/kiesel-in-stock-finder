export const asCurrency = (num: string | number) => {
  return Number(num).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};
