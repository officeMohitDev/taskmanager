"use client";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "@/icons/PlusIcon";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { addTask } from "@/actions";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Client, Project } from "@prisma/client";

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

const TaskForm = ({
  clientList,
  projectList,
}: {
  clientList: Client[];
  projectList: Project[];
}) => {
  const [clientName, setClientName] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [clients, setClients] = useState<any>([]);
  const [clientID, setClientID] = useState("");
  const [status, action] = useFormState(addTask, null as any);

  useEffect(() => {
    const newClients = clientList.map((c: any) => ({
      label: c.name,
      value: c.name,
    }));

    setClients(newClients);
    if (!status) return;
    if (status?.success === true) {
      toast.success(status.message);
    } else {
      toast.error(status?.message);
    }
  }, [status]);

  return (
    <form className="flex flex-col gap-4" action={action}>
      <h1 className="text-3xl font-bold">Add Tasks</h1>
      <div className="flex gap-5">
        <div className="flex flex-col flex-1">
          <Input label="Task" name="task" />
        </div>
        <div className="flex flex-col flex-1">
          <Autocomplete label="Select a client" name="client" allowsCustomValue>
            {clients?.map((c: any) => (
              <AutocompleteItem key={c.label} value={c.value as string}>
                {c.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col flex-1">
        <Select label="Projects" name="project" disabled={!!projectList.length}>
            {projectList?.map((c: any) => (
              <SelectItem key={c.id} value={c.name as string}>
                {c.name}
              </SelectItem>
            ))}
             </Select>

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
      <Button type="submit" color="secondary">
        {" "}
        <span>
          <PlusIcon />
        </span>
        Add
      </Button>
    </form>
  );
};

export default TaskForm;
