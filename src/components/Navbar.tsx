"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import { Input } from "@nextui-org/input";
import NavbarDetails from "./NavbarDetails";
import { getCurrentUser } from "@/actions";
import { usePathname } from "next/navigation";
import { User } from "next-auth";

export default function TaskNavbar() {
  const pathname = usePathname();
  const [data, setData] = useState<any>();
  async function getuser() {
    const res = await getCurrentUser();
    setData(res);
  }

  useEffect(() => {
    getuser();
  }, []);

  return (
    <Navbar isBordered className="bg-black">
      <NavbarContent justify="start">
        <Link href={"/"} className="text-white">
          <NavbarBrand className="mr-4">
            <AcmeLogo />
            <p className="hidden sm:block text-white font-bold text-inherit">
              Task
            </p>
          </NavbarBrand>
        </Link>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem isActive={pathname === "/tasks"}>
            <Link color="foreground" className="text-white" href="/tasks">
              Tasks
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/leaderboards"}>
            <Link
              href="/leaderboards"
              className="text-white"
              aria-current="page"
              color="secondary"
            >
              Leaderboards
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/about"}>
            <Link color="foreground" className="text-white" href="/about">
              About
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
        <NavbarDetails
          email={data?.email as string}
          id={data?.id}
          image={data?.image}
        />
      </NavbarContent>
    </Navbar>
  );
}

const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="#ffffff"
      fillRule="evenodd"
    />
  </svg>
);

const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
