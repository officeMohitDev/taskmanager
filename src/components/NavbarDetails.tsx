"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import React from "react";
import { signOut } from "next-auth/react";
import { Avatar } from "@nextui-org/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavbarDetails = ({
  email,
  id,
  image,
}: {
  email: string;
  id: string;
  image: string;
}) => {
  const router = useRouter();
  return (
    <Dropdown className="bg-black" placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src={image || "/images/noprofile.jpg"}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="solid"
        className="bg-black"
        color="primary"
      >
        <DropdownItem
          key="profile"
          textValue="email"
          className="h-14 text-white gap-2"
        >
          <p className="font-semibold ">Signed in as</p>
          <p className="font-semibold">{email}</p>
        </DropdownItem>
        <DropdownItem
          key="profile"
          textValue="email"
          color="primary"
          className=" text-white"
          onClick={() => router.push(`/profile/${id}`)}
        >
          My Profile
        </DropdownItem>
        <DropdownItem
          key="tasks"
          onClick={() => router.push("/tasks")}
          textValue="email"
          className=" text-white"
        >
          Tasks
        </DropdownItem>
        <DropdownItem
          key="users"
          onClick={() => router.push("/users")}
          textValue="email"
          className=" text-white"
        >
          Users
        </DropdownItem>
        <DropdownItem
          key="clients"
          textValue="email"
          onClick={() => router.push("/clients")}
          className=" text-white"
        >
          Clients
        </DropdownItem>
        <DropdownItem
          key="projects"
          textValue="email"
          onClick={() => router.push("/projects")}
          className=" text-white"
        >
          Projects
        </DropdownItem>
        <DropdownItem
          onClick={async () => {
            await signOut();
          }}
          key="logout"
          color="danger"
          className=" text-white"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NavbarDetails;
