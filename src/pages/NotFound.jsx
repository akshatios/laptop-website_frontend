import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-on-surface-variant">
      <p className="text-headline-lg font-headline-lg">404</p>
      <p className="text-body-lg font-body-lg">Page not found</p>
      <Link to="/" className="text-secondary underline text-label-sm font-label-sm">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
