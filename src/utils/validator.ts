import moment from 'moment';

export function isValidDate(
  dateStr: string = '',
  format: string = 'YYYY-MM-DD'
) {
  const date = moment(dateStr, format, true);
  return date.isValid();
}

export function isValidSort(sort: string) {
  return sort === 'asc' || sort === 'desc';
}
