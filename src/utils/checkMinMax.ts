import BigNumber from 'bignumber.js';

export const checkMin = (comparingValue: string, min: string | number) => {
  const arrayedComparingValue = Array.from(String(comparingValue), Number);
  const arrayedMin = Array.from(String(min), Number);
  if (new BigNumber(min ?? 0).isLessThanOrEqualTo(comparingValue)) return true;
  for (let i = 0; i < arrayedComparingValue.length; i += 1) {
    if (
      !(
        (
          new BigNumber(arrayedMin[i]).isLessThanOrEqualTo(
            new BigNumber(arrayedComparingValue[i]),
          ) || // every symbol should be more or equal to min value
          (Number.isNaN(arrayedMin[i]) && Number.isNaN(arrayedComparingValue[i])) || // '.' elements
          (arrayedComparingValue[i] !== undefined && arrayedMin[i] === undefined)
        ) // if arrayedComparingValue longer than arrayedMin
      )
    ) {
      return false;
    }
  }
  return true;
};

export const checkMinMax = (inputValue: string, min?: string | number, max?: string | number) => {
  let result = false;
  if (max && min) {
    if (
      checkMin(inputValue, min) &&
      (new BigNumber(inputValue).isLessThan(new BigNumber(max)) ||
        new BigNumber(inputValue).isEqualTo(new BigNumber(max)))
    )
      result = true;
  } else if (max) {
    if (
      new BigNumber(inputValue).isLessThan(new BigNumber(max)) ||
      new BigNumber(inputValue).isEqualTo(new BigNumber(max))
    )
      result = true;
  } else if (min) {
    if (checkMin(inputValue, min)) result = true;
  } else result = true;

  return result;
};