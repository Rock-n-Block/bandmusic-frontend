import { addHours, getTime } from 'date-fns';

export const stages = [
  {
    number: '01',
    time: getTime(new Date()),
    status: 'active',
  },
  {
    number: '02',
    time: getTime(addHours(new Date(), 1)),
    status: 'disabled',
  },
  {
    number: '03',
    time: getTime(addHours(new Date(), 2)),
    status: 'disabled',
  },
  {
    number: '04',
    time: getTime(addHours(new Date(), 3)),
    status: 'disabled',
  },
  {
    number: '05',
    time: getTime(addHours(new Date(), 4)),
    status: 'disabled',
  },
];
