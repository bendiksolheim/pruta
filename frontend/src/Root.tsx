import {
  Link,
  LinkProps,
  NavLink,
  Outlet,
  useHref,
  useLinkClickHandler,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import React from "react";

export function Root(): JSX.Element {
  return (
    <>
      <div className="sidebar bg-gray-800 text-white">
        <div className="sidebar-inner px-4 pt-3">
          <Link to="/">Docker Status</Link>
          <hr />
          <Nav className="flex-column" as="ul">
            <NavigationLink to="/" end>
              Containers
            </NavigationLink>
            <NavigationLink to="/images">Images</NavigationLink>
            <NavigationLink to="/networks">Networks</NavigationLink>
          </Nav>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

export const NavigationLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & { end?: boolean }
>(function LinkWithRef(
  {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    end = false,
    ...rest
  },
  ref
) {
  let path = useResolvedPath(to);
  let match = useMatch({ path: path.pathname, end, caseSensitive: false });
  let isActive = match != null;
  let href = useHref(to, { relative });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
  });
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <li className={"nav-item" + (isActive ? " active" : "")}>
      <a
        {...rest}
        href={href}
        onClick={reloadDocument ? onClick : handleClick}
        ref={ref}
        target={target}
        className="nav-link"
      />
    </li>
  );
});
