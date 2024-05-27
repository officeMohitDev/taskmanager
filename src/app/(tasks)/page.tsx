import React from "react";
import TaskForm from "@/components/TaskForm";
import TaskTable from "../../components/TaskTable";
import { auth } from "../../../auth";
import db from "@/db/db";
import { ArrowRight } from "@/icons/ArrowRight";
import Link from "next/link";
import { Client, Project, Task } from "@prisma/client";
export default async function Home() {
  const session = await auth();
  const data = await db.task
    .findMany({
      where: {
        userId: session?.user?.id,
      },
      include: {
        Project: true,
      },
      orderBy: {
        createdAt: "desc", // Sort tasks by creation date in descending order
      },
      take: 5,
    })
    .catch((err) => console.log(err));
  const clientList: any = await db.client
    .findMany({
      where: {
        userId: session?.user?.id,
      },
    })
    .catch((err) => console.log(err));
  const userProjects: any = await db.project
    .findMany({
      where: {
        OR: [
          { userId: session?.user?.id },
          { assignedUsers: { some: { id: session?.user?.id } } },
        ],
      },
    })
    .catch((err) => console.log(err));
  return (
    <div className="mt-6 flex flex-col gap-10">
      <TaskForm clientList={clientList} projectList={userProjects} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1>Recent Task:</h1>
          <Link href={"/tasks"}>
            <ArrowRight />
          </Link>
        </div>
        {data?.length ? (
          <TaskTable data={data} />
        ) : (
          <h1 className="text-center text-3xl mt-6">No Task to display</h1>
        )}
      </div>
    </div>
  );
}
