import db from "@/db/db";
import React from "react";
import AddClientsForm from "../_components/AddClientsForm";

const CreateClientsPage = async () => {
  const projects = await db.project.findMany({});
  return (
    <div>
      <AddClientsForm projects={projects} />
    </div>
  );
};

export default CreateClientsPage;
