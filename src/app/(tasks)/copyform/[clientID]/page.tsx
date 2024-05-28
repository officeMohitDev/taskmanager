import CopyForm from "@/components/CopyForm";
import db from "@/db/db";
import { Input, Textarea } from "@nextui-org/input";
import { Client, Task } from "@prisma/client";
import React from "react";

const CopyFormPage = async ({
  params,
}: {
  params: {
    clientID: string;
  };
}) => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const [clientTask, clientDetails] = await Promise.all([
    db.task.findMany({
      where: {
        clientId: params.clientID as string,
        status: "COMPLETED",
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
    db.client.findUnique({
      where: {
        id: params.clientID,
      },
    }),
  ]);

  const tasks = clientTask.map((c) => `- ${c.task}`).join("\n");

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold">
        Todays Task For {clientDetails?.name}
      </h1>
      <CopyForm clientDetails={clientDetails} tasks={tasks} />
    </div>
  );
};

export default CopyFormPage;
