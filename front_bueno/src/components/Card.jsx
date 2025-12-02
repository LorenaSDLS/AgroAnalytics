export default function Card({title, children, className=""}){
  return (
    <div className={`bg-card-bg bg-dark-green rounded-lg shadow-[4px_4px_0px_#0004] p-4 ${className}`}>
      {title && <h3 className="font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  );
}
