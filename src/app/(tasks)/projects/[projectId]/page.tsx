import db from "@/db/db";
import GithubIcon from "@/icons/GithubIcon";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { auth } from "../../../../../auth";
import SettingsIcon from "@/icons/SettingsIcon";
import { PlusIcon } from "@/icons/PlusIcon";
import { connect } from "http2";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { assigneUsertoTheProject } from "@/actions";
import TaskTable from "@/components/TaskTable";
import { Chip } from "@nextui-org/react";

const SingleProjectPage = async ({
  params,
}: {
  params: { projectId: string };
}) => {
  const currentUser = await auth();
  const project = await db.project.findUnique({
    where: { id: params.projectId },
    include: {
      assignedUsers: true,
      tasks: {
        include: {
          Project: true,
        },
      },
    },
  });
  const clientCreated = await db.client.findFirst({
    where: { projectId: params.projectId },
  });

  // console.log("client", clientCreated);
  return project ? (
    <div className="mt-6 flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-2 rounded-lg bg-[#51FED3] h-8"></div>
            <h3 className="text-2xl font-bold text-white">Project Details</h3>
          </div>
          {currentUser?.user?.id === project?.userId ? (
            <Link href={`/projects/${project?.id}/edit`}>
              <SettingsIcon />
            </Link>
          ) : null}
        </div>
        <div className="flex flex-col md:flex-row gap-7">
          <div className="w-full flex items-center justify-center md:items-start md:justify-start md:w-fit">
            <div className="bg-white w-32 h-32 text-3xl flex justify-center items-center rounded-lg text-black">
              {project?.name?.charAt(0)}
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <h1 className="text-[18px] text-[#C9C9CA] font-semibold">
                {project?.name}
              </h1>
              {project?.status ? (
                <Chip
                  color={
                    project?.status === "COMPLETED"
                      ? "primary"
                      : project.status === "PENDING"
                      ? "warning"
                      : "danger"
                  }
                  size="sm"
                >
                  {project?.status}
                </Chip>
              ) : null}
            </div>

            <div className="flex justify-between w-full gap-5 ">
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">Client Name</h3>
                <p>
                  {clientCreated?.name ? clientCreated.name : "Not specified"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">Github Link</h3>
                <a
                  target="_blank"
                  href={project?.githubLink as string}
                  className="flex gap-2 items-center"
                >
                  <GithubIcon />
                  <span>Github</span>
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">Start Date</h3>
                <p>
                  {project?.startDate
                    ? new Date(project.startDate).toLocaleDateString("en-GB", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "Not specified"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">End Date</h3>
                <p>
                  {project?.endDate
                    ? project.endDate.toLocaleDateString("en-GB", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "Not specified"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">
                  Work on this project{" "}
                </h3>
                <form
                  action={async (FormData) => {
                    "use server";
                    await assigneUsertoTheProject(project?.id as string);
                  }}
                >
                  <button type="submit" className="flex gap-2 items-center">
                    <PlusIcon />
                    <span>
                      {project?.assignedUsers?.some(
                        (user) => user.id === currentUser?.user?.id
                      )
                        ? "User is assigned"
                        : "User is not assigned"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h4 className="text-2xl font-bold">
          Number of Users Worked on this Project
        </h4>
        <div>
          <div>
            <div className="flex gap-3">
              {project?.assignedUsers.map((project) => (
                <Link href={`/profile/${project.id}`}>
                  <Image
                    src={project.image || "/images/noprofile.jpg"}
                    width={70}
                    height={70}
                    alt="user profile"
                    className="rounded-full"
                  />
                  <h3 className="text-center text-[14px]">{project.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1>Recent Tasks</h1>
        <TaskTable data={project?.tasks || []} />
      </div>
    </div>
  ) : (
    <h1>Project not found</h1>
  );
};

export default SingleProjectPage;
