export const createDate = (dataISOstring) => {
  let date;

  if (!dataISOstring) {
    date = new Date();
  } else {
    date = new Date(dataISOstring);
  }

  return date.toLocaleDateString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

export const dataIsoToMysql = (dataISOstring) => {
  const dateArg = createDate(dataISOstring);
  const [date, time] = dateArg.split(' ');

  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day} ${time}`;
};
