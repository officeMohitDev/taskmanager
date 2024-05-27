import React from "react";
import EditProjectForm from "../../(components)/EditProjectForm";
import db from "@/db/db";
import { Button } from "@nextui-org/button";
import { revalidatePath } from "next/cache";
import DeleteProjectButton from "@/components/DeleteProjectButton";

const EditProjectDetails = async ({
  params,
}: {
  params: { projectId: string };
}) => {
  const project = await db.project.findUnique({
    where: { id: params.projectId },
    include: {
      clients: true,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <EditProjectForm
        clients={project?.clients || []}
        id={params.projectId}
        project={project || null}
      />

      <DeleteProjectButton id={params.projectId} />
    </div>
  );
};

export default EditProjectDetails;
