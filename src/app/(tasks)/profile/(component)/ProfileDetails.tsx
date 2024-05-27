"use client";
import TabsComp from "@/components/TabsComp";
import { Client, Project, Task } from "@prisma/client";
import React, { useState } from "react";

type TaskWithProject = Task & {
  Project: Project | null;
};

const ProfileDetails = ({
  about,
  task,
  userData,
  projects,
  clients
}: {
  about: string | null;
  task: TaskWithProject[] ;
  userData: any;
  projects: Project[],
  clients: Client[]
}) => {
  const [selected, setSelected] = useState("activity");
  console.log(selected);
  return (
    <div>
      <TabsComp
        selected={selected}
        about={about}
        setSelected={setSelected}
        task={task}
        userData={userData}
        projects={projects}
        clients={clients}
      />
    </div>
  );
};

export default ProfileDetails;
