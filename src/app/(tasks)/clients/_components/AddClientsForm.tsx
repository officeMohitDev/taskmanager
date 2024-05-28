"use client";
import React, { useState } from "react";
import { PlusIcon } from "@/icons/PlusIcon";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Project } from "@prisma/client";
import { createClient } from "@/actions";
import { toast } from "sonner";
const AddClientsForm = ({ projects }: { projects: Project[] }) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectInput, setProjectInput] = useState<string>("");

  return (
    <form
      className="flex flex-col gap-4"
      action={async (FormData) => {
        const res = await createClient(FormData);

        toast.success(res?.messsage || "success");
      }}
    >
      <h1 className="text-3xl font-bold">Add Project</h1>
      <div className="flex gap-5">
        <div className="flex flex-col flex-1">
          <Input label="Client Name" name="name" />
        </div>
        <div className="flex flex-col flex-1">
          <Input label="Add Project" name="project" />
        </div>
      </div>
      <Button type="submit" color="secondary">
        {" "}
        <span>
          <PlusIcon />
        </span>
        Create Client
      </Button>
    </form>
  );
};

export default AddClientsForm;
