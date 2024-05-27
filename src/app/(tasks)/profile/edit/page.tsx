import { getCurrentUser } from "@/actions";
import db from "@/db/db";
import Image from "next/image";
import React from "react";
import PersonalDetailsFrom from "../(component)/PersonalDetailsFrom";
import { Project, User } from "@prisma/client";

const ProfileEditPage = async () => {
  const currentUser = await getCurrentUser();
  const userData: User | null = await db.user.findUnique({
    where: { id: currentUser?.id },
  });

  const userProjects: Project[] | null = await db.project.findMany({
    where: { userId: userData?.id },
  });
  return (
    <div className="mt-6 flex flex-col gap-7">
      <div>
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-2 rounded-lg bg-[#51FED3] h-8"></div>
            <h3 className="text-2xl font-bold text-white">Personal Details</h3>
          </div>
        </div>
        <PersonalDetailsFrom projectData={userProjects} data={userData} />
      </div>
    </div>
  );
};

export default ProfileEditPage;
