
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Footer = () => {
  const { store } = useGlobalReducer();

  return (
    <footer className="fixed-bottom bg-light border-top py-2">
      <div className="container text-center small text-muted">
        {store.message ? (
          <span>{store.message}</span>
        ) : (
          <span>
            Loading message from the backend (make sure your pythons 🐍 backend is running)...
          </span>
        )}
      </div>
    </footer>
  );
};
