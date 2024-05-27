"use client";
import { updateProjectDetails, updateUserDetails } from "@/actions";
import { PlusIcon } from "@/icons/PlusIcon";
import { Input, Textarea } from "@nextui-org/input";
import { Button, DatePicker } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Client, Project } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
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

const EditProjectForm = ({
  clients,
  id,
  project,
}: {
  clients: Client[];
  id: string;
  project: Project | null;
}) => {
  const [clientName, setClientName] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [projectName, setProjectName] = useState(project?.name);
  const [status, action] = useFormState(
    updateProjectDetails.bind(null, id),
    null as any
  );
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
  const [startDate, setStartDate] = useState<DateValue>();
  const [endDate, setEndDate] = useState<DateValue>();
  return (
    <div className="mt-6">
      <form
        className="flex flex-col gap-4"
        action={async (FormData) => {
          await updateProjectDetails(id, null, FormData).then((res) => {
            if (!res?.success) {
              toast.error(res?.message);
            } else {
              toast.success("Updated");
            }
          });
        }}
      >
        <h1 className="text-3xl font-bold">Update Project</h1>
        <div className="flex gap-5">
          <div className="flex flex-col flex-1">
            <Input
              label="Project Name"
              name="name"
              defaultValue={project?.name as string}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex flex-col flex-1">
            <Input
              label="Github Link"
              value={project?.githubLink as string}
              name="githubLink"
            />
          </div>
          <div className="flex flex-col flex-1">
            <Select
              label="Status"
              name="status"
              defaultSelectedKeys={[project?.status as string]}
              disabled={!!statuss.length}
            >
              {statuss.map((c) => (
                <SelectItem key={c.label} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex gap-5 ">
          {project?.startDate ? (
            <>
              <DatePicker
                defaultValue={
                  parseDate(
                    JSON.stringify(project?.startDate).split("T")[0].slice(1)
                  ) || ""
                }
                value={startDate}
                onChange={setStartDate}
                label="Start Date"
                className="flex-1"
                name="startDate"
              />
              <DatePicker
                defaultValue={parseDate(
                  JSON.stringify(project?.endDate).split("T")[0].slice(1)
                )}
                onChange={setEndDate}
                label="End Date"
                className="flex-1"
                name="endDate"
              />
            </>
          ) : (
            <>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                label="Start Date"
                className="flex-1"
                name="startDate"
              />
              <DatePicker
                onChange={setEndDate}
                label="End Date"
                className="flex-1"
                name="endDate"
              />
            </>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <Textarea
            defaultValue={project?.description as string}
            label="Description"
            name="description"
          />
        </div>
        <Button type="submit" color="secondary">
          {" "}
          <span>
            <PlusIcon />
          </span>
          Update Project
        </Button>
      </form>
    </div>
  );
};

export default EditProjectForm;
