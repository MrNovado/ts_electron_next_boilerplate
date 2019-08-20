import React from "react";
import Link from "next/link";

import { useRouter } from "next/router";

type NavLinkProps = {
  activeClassName?: string;
  className?: string;
  href: string;
  as: string;
  passHref?: boolean;
};

function NavLink({
  children,
  activeClassName = "active",
  href,
  as,
  passHref = true,
}: NavLinkProps & { children: React.ReactElement<NavLinkProps> }) {
  const router = useRouter();
  const child = children;

  const className: string = [activeClassName].reduce((acc, value) => {
    if (router.asPath === as) {
      return (acc = `${className} ${value}`.trim());
    } else {
      return acc;
    }
  }, child.props.className || "");

  return (
    <Link href={href} as={as} passHref={passHref}>
      {React.cloneElement(child, { className })}
    </Link>
  );
}

export default NavLink;
