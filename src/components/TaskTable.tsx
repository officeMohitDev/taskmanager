"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";
import { Task, Project } from "@prisma/client";

import { changeStatusOfTask, deleteTask, updateTask } from "@/actions";
type TaskWithProject = Task & {
  Project: Project | null;
};

const statusTask: any = {
  PENDING: "warning",
  COMPLETED: "success",
  IN_PROGRESS: "secondary",
};

export default function TaskTable({ data }: { data: Task[] }) {
  const [editDetails, setEditDetails] = useState<any>({});
  const [editTask, setEditTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      className=""
    >
      <TableHeader>
        <TableColumn width={200}>TASK</TableColumn>
        <TableColumn width={100}>CLIENT NAME</TableColumn>
        <TableColumn width={100}>PROJECT NAME</TableColumn>
        <TableColumn width={100}>STATUS</TableColumn>
        <TableColumn width={100}>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((data: any) => (
            <TableRow key={data?.id}>
              <TableCell>
                {isEditing && editDetails.id === data.id ? (
                  <form
                    onSubmit={() => {
                      updateTask(editDetails.id, editTask, data.userId);
                      setIsEditing(false);
                      setEditDetails("");
                      setEditTask("");
                    }}
                  >
                    <Input
                      defaultValue={editDetails.task}
                      // className="py-1 w-[70%] rounded-lg border border-white bg-black"
                      name="task"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                    />
                  </form>
                ) : (
                  <p>
                    {data?.task
                      ? data.task.length > 50
                        ? data.task.slice(0, 30)
                        : data.task
                      : ""}
                  </p>
                )}
              </TableCell>
              <TableCell>{data?.clientName}</TableCell>
              <TableCell>{data?.Project?.name}</TableCell>
              <TableCell
                className="cursor-pointer"
                onClick={async () =>
                  await changeStatusOfTask(data?.id, data.userId)
                }
              >
                <Chip
                  className="capitalize"
                  color={statusTask[data?.status as any]}
                  size="sm"
                  variant="flat"
                >
                  {data?.status}
                </Chip>
              </TableCell>
              <TableCell>
                {" "}
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <VerticalDotsIcon className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem>View</DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        console.log(data);
                        setEditDetails(data);
                        setEditTask(data.task);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      color="danger"
                      onClick={async () =>
                        await deleteTask(data.id, data.userId)
                      }
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
