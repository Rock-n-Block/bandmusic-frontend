type TFormat = 'withCommas' | 'compact';

const formatNumber = (value: string, format: TFormat = 'withCommas', digits = 2) => {
  switch (format) {
    case 'withCommas': {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    case 'compact': {
      const suf = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'K' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'B' },
        { value: 1e12, symbol: 'T' },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      const item = suf
        .slice()
        .reverse()
        .find((el) => {
          return parseFloat(value) >= +el.value;
        });
      return item
        ? (+value / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
        : parseFloat(value).toFixed(digits);
    }
    default: {
      return value;
    }
  }
};

export default formatNumber;
