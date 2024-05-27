"use client";
import { createProject } from "@/actions";
import { PlusIcon } from "@/icons/PlusIcon";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Client } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const statuss = [
  {
    label: "IN_PROGRESS",
    value: "IN_PROGRESS",
  },
  {
    label: "COMPLETED",
    value: "COMPLETED",
  },
  {
    label: "PENDING",
    value: "PENDING",
  },
];

const ProjectAddForm = ({ clients }: { clients: Client[] }) => {
  const [clientName, setClientName] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [status, action] = useFormState(createProject, null);

  useEffect(() => {
    if (!status) {
      return;
    }
    if (status?.success) {
      toast.success("Successfully created Project");
    } else {
      toast.error("Error while creating Project");
    }
  }, [status]);
  return (
    <div className="mt-6">
      <form className="flex flex-col gap-4" action={action}>
        <h1 className="text-3xl font-bold">Add Project</h1>
        <div >
          <div className="flex flex-col flex-1">
            <Input label="Project Name" name="name" />
          </div>
          
        </div>
        <div className="flex gap-5">
        <div className="flex flex-col flex-1">
            <Input label="Github Link" name="githubLink" />
          </div>
          <div className="flex flex-col flex-1">
            <Select
              label="Select a client"
              name="client"
              onChange={(val) => setClientName(val.target.value)}
            >
              {clients.map((c: any) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex flex-col flex-1">
            <Input
              label="Add Client (optional)"
              disableAnimation
              disabled={!!clientName}
              value={clientName ? "" : clientInput}
              onChange={(val) => setClientInput(val.target.value)}
              name="client"
            />
          </div>
          <div className="flex flex-col flex-1">
            <Select label="Status" name="status" disabled={!!statuss.length}>
              {statuss.map((c) => (
                <SelectItem key={c.label} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex gap-5 ">
          <DatePicker label="Start Date" className="flex-1" name="startDate" />
          <DatePicker label="End Date" className="flex-1" name="endDate" />
        </div>
        <div className="flex flex-col flex-1">
          <Textarea label="Description" name="description" />
        </div>
        <Button type="submit" color="secondary">
          {" "}
          <span>
            <PlusIcon />
          </span>
          Create Project
        </Button>
      </form>
    </div>
  );
};

export default ProjectAddForm;
