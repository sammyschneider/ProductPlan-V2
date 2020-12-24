export const oneWeekMillis = 6.048e8;

export function defaultRange() {
  const start = new Date();
  const end = new Date();
  end.setFullYear(start.getFullYear() + 1);
  shiftDateMillis(start, -oneWeekMillis);
  shiftDateMillis(end, oneWeekMillis);
  return { start, end };
}

export function dateToFraction(date, range) {
  const { start, end } = range;
  const total = end.getTime() - start.getTime();
  return (date.getTime() - start.getTime()) / total;
}

export function* axisMonths(range) {
  let first = true;
  for (let month of monthsToShow(range)) {
    const label = axisMonthLabel(month, first);
    yield { month, label };
    first = false;
  }
}

export function shiftDateMillis(date, millis) {
  date.setTime(date.getTime() + millis);
}

export function millisToDate(millis) {
  const date = new Date();
  date.setTime(millis);
  return date;
}

export function* monthsToShow(range) {
  const { start, end } = range;
  let m = start.getMonth();
  let y = start.getFullYear();
  const endM = end.getMonth();
  const endY = end.getFullYear();
  if (start.getDate() > 1) {
    m++;
  }
  while (true) {
    if (m === 12) {
      m = 0;
      y++;
    }

    if (y > endY || (y === endY && m > endM)) {
      break;
    }

    yield new Date(y, m);
    m++;
  }
}

export function axisMonthLabel(month, first) {
  const y = month.getFullYear();
  let q = null;
  let showYear = first;
  const m = month.getMonth();
  const showQ = m % 3 === 0;

  if (showQ) {
    q = m / 3 + 1;
    if (q === 1) {
      showYear = true;
    }
  }

  if (showQ && showYear) {
    return `Q${q} ${y}`;
  }

  if (showQ) {
    return `Q${q}`;
  }

  if (showYear) {
    return `${y}`;
  }

  return null;
}
