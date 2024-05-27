import React from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { Client, Project, Task, User } from "@prisma/client";
import Link from "next/link";

type TaskWithProject = Task & {
  Project: Project | null;
};

export default function TabsComp({
  selected,
  setSelected,
  about,
  task,
  userData,
  projects,
  clients
}: {
  selected: string;
  setSelected: any;
  about: string | null;
  task: TaskWithProject[];
  userData: User;
  projects: Project[],
  clients: Client[]
}) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        selectedKey={selected}
        onSelectionChange={setSelected}
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab
          key="activity"
          title={
            <div className="flex items-center space-x-2">
              <span>Activity</span>
            </div>
          }
        >
          Hello
        </Tab>
        <Tab
          key="about"
          title={
            <div className="flex items-center space-x-2">
              <span>About</span>
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h4 className="text-gray-500 text-[16px]">About</h4>
              <p className="text-[14px]">{about} </p>
            </div>
            <div className="flex flex-col gap-3"> 
              <h4 className="text-gray-500 text-[16px]">Clients</h4>
              
              <div className="grid grid-cols-3 gap-3">
                {
                  clients.map(client => (
                    <Link href={`/clients/${client.id}`}  className="p-3 rounded-lg bg-[#2A2B2C]">
                      <h1>{client.name}</h1>
                    </Link>
                  ))
                }
              </div>
            </div>
            <div className="flex flex-col gap-3"> 
              <h4 className="text-gray-500 text-[16px]">Projects</h4>
              
              <div className="grid grid-cols-3 gap-3">
                {
                  projects.map(project => (
                    <Link href={`/projects/${project.id}`} className="p-3 rounded-lg bg-[#2A2B2C]">
                      <h1>{project.name}</h1>
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
          
        </Tab>
      </Tabs>
    </div>
  );
}
