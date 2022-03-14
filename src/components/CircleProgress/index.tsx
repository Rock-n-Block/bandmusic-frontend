import { VFC } from 'react';

const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0;
  const isTooHigh = percentage > 100;
  // eslint-disable-next-line no-nested-ternary
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

interface ICircle {
  color?: string;
  percentage?: number;
}

const Circle: VFC<ICircle> = ({ color, percentage = 100 }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100;
  return (
    <circle
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circ ? color : ''} // remove colour as 0% sets full circumference
      strokeWidth="1rem"
      strokeDasharray={circ}
      strokeDashoffset={percentage ? strokePct : 0}
      strokeLinecap="round"
      style={{ transition: '450ms ease-in-out' }}
    />
  );
};

interface IText {
  percentage: number;
}

const Text: VFC<IText> = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="1.5em"
      fill="#fff"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

interface IPie {
  color?: string;
  percentage: number;
}

const Pie: VFC<IPie> = ({ percentage, color }) => {
  const pct = cleanPercentage(percentage);
  return (
    <svg width={200} height={200}>
      <g transform={`rotate(-90 ${'100 100'})`}>
        <Circle color="rgba(117, 121, 136, 0.25)" />
        <Circle color={color} percentage={pct} />
      </g>
      <Text percentage={pct} />
    </svg>
  );
};

export default Pie;
