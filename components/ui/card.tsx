interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export default Card;
