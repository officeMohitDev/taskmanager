import db from "@/db/db";
import ClientsIcon from "@/icons/ClientsIcon";
import ProjectsIcon from "@/icons/ProjectsIcon";
import TaskIcon from "@/icons/TaskIcon";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip, LinkIcon } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UsersPage = async () => {
  const users = await db.user.findMany();

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">List Of Users</h1>
        <div className="grid grid-cols-2 gap-5">
          {users?.map(async (user) => {
            const [task, clients] = await Promise.all([
              db.task
                .findMany({ where: { userId: user?.id } })
                .catch((err) => console.log(err)),

              db.client
                .findMany({ where: { userId: user?.id } })
                .catch((err) => console.log(err)),
            ]);

            return (
              <Card key={user.id} className="flex justify-center">
                <div className="!flex gap-3 py-3 px-6 items-center justify-between">
                  <div className="flex flex-[5] gap-4 items-center">
                    <Image
                      src={user.image || "/images/noprofile.jpg"}
                      className="rounded-full"
                      width={100}
                      height={100}
                      alt="profileimaeg"
                    />
                    <div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <div className="flex gap-2 items-center">
                            <h1 className="text-[18px] text-[#C9C9CA] font-semibold">
                              {user.name}
                            </h1>
                            {user.status && (
                              <Chip
                                color={
                                  user.status === "free"
                                    ? "primary"
                                    : user.status === "onVacation"
                                    ? "warning"
                                    : "danger"
                                }
                                size="sm"
                              >
                                {user.status}
                              </Chip>
                            )}
                          </div>
                          <p className="text-gray-500 text-[12px]">
                            {user.role ? user.role : "Not specified"}
                          </p>
                        </div>
                        <p className="text-[16px]">
                          {user.about
                            ? user.about.length > 80
                              ? `${user.about.slice(0, 80)}...`
                              : user.about
                            : "Not specified"}
                        </p>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-3">
                            <TaskIcon width={20} height={20} />
                            <p>{task?.length}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <ClientsIcon width={20} height={20} />
                            <p>{clients?.length}</p>
                          </div>
                          <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center gap-2 transition duration-100 ease-in hover:text-[#1F51FF] "
                          >
                            <LinkIcon />
                            <p>Visit</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <Link href={`/profile/${user.id}`} className="flex-[1] w-full">
                  <Button color="secondary" size="sm" className="w-full">
                    Visit
                  </Button>
                </Link> */}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
