export const convertTimePeriod = (timePeriod: string) => {
  const [start, end] = timePeriod.split(" - ");
  const startDate = new Date(start);
  const endDate = new Date(end);

  return { startDate, endDate };
};
