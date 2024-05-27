import db from "@/db/db";
import { PlusIcon } from "@/icons/PlusIcon";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const ProjectPage = async () => {
  const projects = await db.project.findMany({ include: { user: true } });
  return (
    <div className="mt-6">
      <div className="justify-between flex items-center">
        <h1 className="text-2xl font-bold">Project List</h1>
        <Link href={"/projects/create"}>
          <Button type="submit" color="secondary">
            {" "}
            <span>
              <PlusIcon />
            </span>
            Create Project
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 mt-4">
        {projects?.map((project, i) => {
          return (
            <Card
              className={`${
                projects.length % 2 !== 0 && projects.length - 1 === i
                  ? "col-span-2"
                  : ""
              }`}
            >
              <CardHeader>
                <Link href={`/projects/${project.id}`} className="flex gap-3">
                  <div className="bg-black w-12 h-12 rounded-md flex items-center justify-center text-white text-xl">
                    {project.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md">{project.name}</p>
                    <p className="text-small text-default-500">
                      {project?.user?.name}
                    </p>
                  </div>
                </Link>
              </CardHeader>
              <Divider />
              {project.description && (
                <CardBody>
                  <p>{project.description}</p>
                </CardBody>
              )}
              <Divider />
              <CardFooter className="mt-auto">
                <a target="_blank" href={project.githubLink as string}>
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

export default ProjectPage;
