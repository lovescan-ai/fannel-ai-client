interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-brandBlue4x h-2.5 rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export default ProgressBar;
