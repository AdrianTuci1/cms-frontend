export const generateDatesArray = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return checkDate >= start && checkDate < end;
};

export const isDateRangeOverlapping = (start1, end1, start2, end2) => {
  const startDate1 = new Date(start1);
  const endDate1 = new Date(end1);
  const startDate2 = new Date(start2);
  const endDate2 = new Date(end2);

  return startDate1 < endDate2 && startDate2 < endDate1;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export function getNextTwoWeeks() {
  const today = new Date();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);
  
  return {
    startDate: today.toISOString().split('T')[0],
    endDate: twoWeeksLater.toISOString().split('T')[0]
  };
} 