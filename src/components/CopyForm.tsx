"use client";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Client, Task } from "@prisma/client";
import React, { useState } from "react";

const CopyForm = ({
  clientDetails,
  tasks,
}: {
  clientDetails: Client | null;
  tasks: string;
}) => {
  const [taskMsg, setTaskMsg] = useState(tasks);
  const [note, setNote] = useState("");
  return (
    <div className="flex flex-col min-h-screen mt-6">
      <div className="flex flex-col gap-4">
        <Input label="Client Name" value={clientDetails?.name as string} />
        <Textarea
          label={"Task List"}
          value={taskMsg}
          onChange={(e) => setTaskMsg(e.target.value)}
        />
        <Input
          label="Note (Optional)"
          name="custom message"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {taskMsg ? (
          <div className="">
            <Textarea
              disableAutosize
              label="Formatted Message"
              rows={13}
              height={"auto"}
              value={`
Hello ${clientDetails?.name},
Today's work details:
${taskMsg}
${
  note
    ? ` 
Note: ${note}`
    : ""
}

I am leaving, for now, if you have something please drop me a message. I will check it tomorrow.
Have a nice day..!!

Thank you`}
              readOnly
            />
          </div>
        ) : (
          <h1 className="text-xl text-center font-bold">
            No task or Not Task has been completed
          </h1>
        )}
      </div>
      <Button
        color="primary"
        disabled={!taskMsg}
        className="w-full mt-4 self-end"
        onClick={() =>
          navigator.clipboard.writeText(`Hello ${clientDetails?.name},
Today's work details:
${tasks}
${
  note
    ? ` 
Note: ${note}`
    : ""
}

I am leaving, for now, if you have something please drop me a message. I will check it tomorrow.
Have a nice day..!!

Thank you`)
        }
      >
        Copy
      </Button>
    </div>
  );
};

export default CopyForm;
