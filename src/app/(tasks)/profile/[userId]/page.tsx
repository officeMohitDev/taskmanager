import db from "@/db/db";
import ClientsIcon from "@/icons/ClientsIcon";
import ProjectsIcon from "@/icons/ProjectsIcon";
import RankIcon from "@/icons/RankIcon";
import TaskIcon from "@/icons/TaskIcon";
import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import ProfileDetails from "../(component)/ProfileDetails";
import { getCurrentUser } from "@/actions";
import SettingsIcon from "@/icons/SettingsIcon";
import Link from "next/link";
import { Chip } from "@nextui-org/react";
import { auth } from "../../../../../auth";
const SingleUserProfilePage = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const session = await auth();
  const userId = session?.user?.id;
  const [userData, currentUser, totalTasks, projects, clients] = await Promise.all([
    db.user.findUnique({
      where: { id: params.userId },
      include: {
        activeProject: true,
        Task: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            Project: true,
          },
        },
        clients: true,
        Project: true,
        assignedProject: true,
      },
    }),
    getCurrentUser(),
    db.task.count({ where: { userId: params.userId, status: "COMPLETED" } }),
    db.project.findMany({where: {
      OR: [
        { userId: userId },
        { assignedUsers: { some: { id: userId } } },
      ],
    }}),
    db.client.findMany({where: {userId: userId}})
  ]);

  if (!userData) {
    return <h1>User not found</h1>;
  }
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-8">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-2 rounded-lg bg-[#51FED3] h-8"></div>
            <h3 className="text-2xl font-bold text-white">Employee Details</h3>
          </div>
          {currentUser?.id === params.userId ? (
            <Link href={"/profile/edit"}>
              <SettingsIcon />
            </Link>
          ) : null}
        </div>
        <div className="flex flex-col md:flex-row gap-7">
          <div className="w-full flex items-center justify-center md:items-start md:justify-start md:w-fit">
            <Image
              src={(userData.image as string) || "/images/noprofile.jpg"}
              alt="profile"
              width={120}
              className="rounded-full object-cover"
              height={120}
            />
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <h1 className="text-[18px] text-[#C9C9CA] font-semibold">
                {userData.name}
              </h1>
              {userData.status ? (
                <Chip
                  color={
                    userData?.status === "Free"
                      ? "primary"
                      : userData.status === "On Vacation"
                      ? "warning"
                      : "danger"
                  }
                  size="sm"
                >
                  {userData?.status}
                </Chip>
              ) : null}
            </div>
            <div className="flex justify-between w-full gap-5 ">
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">Role</h3>
                <p>{userData?.role ? userData.role : "Not specified"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">Phone Number</h3>
                <p>{userData?.contact ? userData.contact : "Not specified"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#BCBCBD] font-[14px]">Email Address</h3>
                <p>{userData?.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-3 flex-wrap">
          <div className="bg-[#2A2B2C] rounded-md md:flex-1 flex-grow py-5 px-3 flex gap-2">
            <div className="bg-[#3F4041] p-3 rounded-full">
              <ProjectsIcon />
            </div>
            <div>
              <h4 className="texrt-[16px] text-[#C9C9CA]">
                {userData.Project?.length}
              </h4>
              <p>Projects Worked On</p>
            </div>
          </div>
          <div className="bg-[#2A2B2C] rounded-md md:flex-1 flex-grow py-5 px-3 flex gap-2">
            <div className="bg-[#3F4041] p-3 rounded-full">
              <ClientsIcon />
            </div>
            <div>
              <h4 className="texrt-[16px] text-[#C9C9CA]">
                {userData?.clients?.length}
              </h4>
              <p>Clients</p>
            </div>
          </div>
          <div className="bg-[#2A2B2C] rounded-md md:flex-1 flex-grow py-5 px-3 flex gap-2">
            <div className="bg-[#3F4041] p-3 rounded-full">
              <TaskIcon />
            </div>
            <div>
              <h4 className="texrt-[16px] text-[#C9C9CA]">{totalTasks}</h4>
              <p>Task Completed</p>
            </div>
          </div>
          <div className="bg-[#2A2B2C] rounded-md md:flex-1 flex-grow py-5 px-3 flex gap-2">
            <div className="bg-[#13A451] p-3 rounded-full">
              <ProjectsIcon />
            </div>
            <div>
              <h4 className="texrt-[16px] text-[#C9C9CA]">Current Project</h4>
              <p>{userData.activeProject?.name}</p>
            </div>
          </div>
        </div>
        <div>
          <ProfileDetails
            about={userData?.about}
            userData={userData}
            task={userData.Task}
            projects={projects}
            clients={clients}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleUserProfilePage;
