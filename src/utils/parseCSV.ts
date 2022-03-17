import BigNumber from 'bignumber.js';
import utils from 'web3-utils';

import { TFileLine } from '@/store/Models/Owner';
import { saleOptions, TSaleType } from '@/types';

const parseCSV = (csv: string[]) => {
  const data: TFileLine[] = [];
  const errs: string[] = [];
  csv.forEach((line, key) => {
    if (csv.length > 0) {
      if (line.replaceAll(' ', '').replaceAll('\r', '').length === 0) return;
      const [address, type, amount, timestamp] = line
        .replaceAll('"', '')
        .replaceAll(';', ',')
        .split(',');
      if (address.length < 40 || !utils.checkAddressChecksum(address)) {
        errs.push(`error address at line ${key + 1}\n${address}`);
        return;
      }
      if (Number.isNaN(new Date(timestamp))) {
        errs.push(`error date at line ${key + 1}\n${data}`);
        return;
      }
      if (Number.isNaN(parseFloat(amount))) {
        errs.push(`error amount at line ${key + 1}\n${amount}`);
        return;
      }
      if (!saleOptions.includes(type as TSaleType)) {
        errs.push(`error type at line ${key + 1}\n${type}`);
        return;
      }
      const idx = data.findIndex(
        (value) =>
          value.address === address && value.timestamp === +timestamp && value.saleType === type,
      );
      if (idx === -1) {
        data.push({
          address,
          saleType: type,
          timestamp: +new Date(+timestamp).getTime() || +(new Date(timestamp).getTime() / 1000),
          amount,
          idx: `new${key}`,
        });
      } else {
        data[idx] = {
          ...data[idx],
          amount: new BigNumber(amount).plus(data[idx].amount).toString(),
        };
      }
    }
  });
  return { data, errs };
};

export default parseCSV;
