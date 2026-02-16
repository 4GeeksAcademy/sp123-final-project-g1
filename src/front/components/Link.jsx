import { Link as RouterLink } from "react-router-dom";

export const Link = ({ to, children, ...props }) => {
  const isExternal = /^https?:\/\//.test(to); // Checks if it's an external URL
  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
};
