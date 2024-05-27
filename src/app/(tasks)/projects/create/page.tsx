import React from "react";
import ProjectAddForm from "../(components)/ProjectAddForm";
import { Client } from "@prisma/client";
import db from "@/db/db";
import { auth } from "../../../../../auth";

const CreateProject = async () => {
  const currentUser = await auth();
  const clientList = await db.client.findMany({
    where: {
      userId: currentUser?.user?.id,
    },
  });
  console.log(clientList, "clietnlist");
  return (
    <div>
      <ProjectAddForm clients={clientList} />
    </div>
  );
};

export default CreateProject;
