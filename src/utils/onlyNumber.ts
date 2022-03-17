const onlyNumbers = (value: string) => {
  // eslint-disable-next-line no-restricted-globals
  if (!value.match(/^\d+(\.)?(\d{1,18})?$|^$/) || value === '00') {
    return false;
  }

  return true;
};

export default onlyNumbers;