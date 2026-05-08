export function periodToDateRange(period) {
  const endDate = new Date();
  const startDate = new Date();

  const map = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 };
  startDate.setDate(startDate.getDate() - (map[period] ?? 30));

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export function periodToDays(period) {
  return { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 }[period] ?? 30;
}
