import db from "@/db/db";
import { PlusIcon } from "@/icons/PlusIcon";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import React from "react";

const ClientsPage = async () => {
  const clients = await db.client.findMany({
    include: {
      user: true,
      Project: true,
    },
  });
  return (
    <div className="mt-6">
      <div className="justify-between flex items-center">
        <h1 className="text-2xl font-bold">Client List</h1>
        {/* <Link href={"/projects/create"}>
          <Button type="submit" color="secondary">
            {" "}
            <span>
              <PlusIcon />
            </span>
            Create Project
          </Button>
        </Link> */}
      </div>
      <div className="grid grid-cols-2 gap-5 mt-4">
        {clients?.map((client, i) => {
          return (
            <Card>
              <CardHeader>
                <div className="flex gap-3">
                  <div className="bg-black w-12 h-12 rounded-md flex items-center justify-center text-white text-xl">
                    {client.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md">{client.name}</p>
                    <p className="text-small text-default-500">
                      {client?.user.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              {client.Project && (
                <CardBody>
                  <p>Project: {client.Project.name}</p>
                </CardBody>
              )}
              <Divider />
              <CardFooter className="mt-auto">
                <a target="_blank" href={client?.Project?.githubLink as string}>
                  Visit source code on GitHub.
                </a>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClientsPage;
