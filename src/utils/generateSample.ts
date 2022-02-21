const getRandomIntInclusive = (min: number, max: number) => {
  const minimal = Math.ceil(min);
  const maximal = Math.floor(max);
  return Math.floor(Math.random() * (maximal - minimal + 1)) + minimal;
};

const generateCSV = () => {
  const addrs = [
    '0x063C22e0917b4B051cb81Ef91c5052Cd8C0D0E56',
    '0xBF7E42e9254A5E64D946bD206120ae5BafaC7781',
  ];
  const repeats = 1;
  const delay = 20 * 60;
  const timestamp = Date.now() / 1000;
  const csvData: any[] = [];
  for (let i = 0; i < repeats; i += 1) {
    addrs.forEach((addr) => {
      csvData.push([addr, 'Pre-sale', getRandomIntInclusive(1, 1000), timestamp + delay * (i + 1)]);
    });
  }
  const csvExampleText = csvData.reduce(
    (acc, value) => `${acc}${value[0]},${value[1]},${value[2]},${Math.ceil(value[3])}\n`,
    '',
  );
  const csvFile = new Blob([csvExampleText], { type: 'text/csv' });
  return new File([csvFile], 'sample.csv');
};

export default generateCSV;
