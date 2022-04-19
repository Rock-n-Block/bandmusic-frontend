const splitAddress = (address: string, start = 7, end = 5): string => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export default splitAddress;
