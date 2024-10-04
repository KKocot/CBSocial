"use client";

import Link from "next/link";

import { ModeToggle } from "./theme-menu";
import LanguageToggle from "./language-toggle";
import Image from "next/image";

import { ProfileMenu } from "./profile-menu";
import { ProtectedLinks } from "./protected-links";

export default function Navbar() {
  return (
    <nav className="flex items-center border-b-2 border-primary backdrop-blur px-8 py-1 sticky top-0 z-10">
      <Link className="size-10 relative" href={"/"}>
        <Image src="/logo.png" alt="logo" fill />
      </Link>
      <ProtectedLinks />
      <div className="flex items-center gap-2 ml-auto">
        <ProfileMenu />
        <ModeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
}
