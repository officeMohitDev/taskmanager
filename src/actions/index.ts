"use server";

import db from "@/db/db";
import { TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "../../auth";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { connect } from "http2";
import { user } from "@nextui-org/theme";

export async function verifyUser(id: string) {
  try {
    const res = await auth();
    return res?.user?.id === id;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function registerUser(prev: unknown, formdata: FormData) {
  const result = Object.fromEntries(formdata.entries());
  try {
    const { name, email, password, Confirmpassword } = result;

    // Check if any of the fields are empty
    if (!name || !email || !password || !Confirmpassword) {
      return { message: "All fields are required", success: false };
    }

    if (password !== Confirmpassword) {
      return {
        message: "Password and confirm password should match",
        success: false,
      };
    }
    // Check if email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email as string)) {
      return { message: "Invalid email format", success: false };
    }
    // Check if name is alphanumeric with optional underscore and hyphen, and between 3 to 20 characters long
    const nameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!nameRegex.test(name as string)) {
      return {
        message:
          "name must be 3 to 20 characters long and contain only letters, numbers, underscore, or hyphen",
        success: false,
      };
    }

    const user = await db.user.findFirst({
      where: {
        OR: [{ email: email as string }, { name: name as string }],
      },
    });

    if (user) {
      return {
        message: "User already exist with that name or email",
        success: false,
      };
    }

    const hashedPass = await bcrypt.hash(password as string, 10);

    const res = await db.user.create({
      data: {
        name: name as string,
        email: email as string,
        password: hashedPass,
      },
    });
    console.log(res);
    redirect("/login");
    return { message: "user register successfully", success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function loginUser(prev: unknown, formdata: FormData) {
  const result = Object.fromEntries(formdata.entries());
  const { email, password } = result;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { error: "Logged in" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Wrong Credentials" };
        default:
          console.log("wrong");

          return { error: "something went wrong" };
      }
    }
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const res = await auth();
    return await db.user.findUnique({ where: { id: res?.user?.id } });
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUserData() {}

export async function addTask(prev: unknown, formdata: FormData) {
  const result = Object.fromEntries(formdata.entries());

  try {
    const { task, client, status, project } = result;
    console.log("result", result);

    if (!task || !client || !status) {
      return { success: false, message: "Please fill out the form" };
    }

    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "User is not authenticated" };
    }

    const userId = session.user.id;

    // Find or create the client
    let clientExist = await db.client.findFirst({
      where: {
        name: client as string,
        userId: userId,
      },
    });

    if (!clientExist) {
      clientExist = await db.client.create({
        data: {
          name: client as string,
          userId: userId,
        },
      });
    }

    let projectExist = null;

    if (project) {
      projectExist = await db.project.findFirst({
        where: {
          id: project as string,
          userId: userId,
        },
      });

      if (!projectExist) {
        return { success: false, message: "Project does not exist" };
      }
    }

    const taskStatus = status as string;
    if (!["PENDING", "COMPLETED", "IN_PROGRESS"].includes(taskStatus)) {
      return { success: false, message: "Invalid task status" };
    }

    const taskData: any = {
      task: task as string,
      clientName: clientExist.name as string,
      status: taskStatus,
      userId: userId,
      clientId: clientExist.id,
    };

    if (projectExist) {
      taskData.projectId = projectExist.id;

      // Update client with projectId if project exists
      await db.client.update({
        where: { id: clientExist.id },
        data: {
          projectId: projectExist.id,
        },
      });
    }

    const taskDb = await db.task.create({
      data: taskData,
    });

    console.log(taskDb);
    revalidatePath("/");
    revalidatePath("/tasks");
    return { success: true, message: "Task has been created" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Problem while creating the task" };
  }
}
export async function deleteTask(id: string, userId: string) {
  try {
    const owner = await verifyUser(userId);
    if (!owner) {
      return { success: false, message: "You cant delete someone else's task" };
    }
    const res = await db.task.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/tasks");
    return { success: true, message: "Task Deleted Successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateTask(id: string, task: string, userId: string) {
  try {
    const owner = await verifyUser(userId);
    if (!owner) {
      return {
        success: false,
        message: "You cant update someone else's task ",
      };
    }
    const res = await db.task.update({
      where: {
        id: id,
      },
      data: {
        task: task,
      },
    });
    revalidatePath("/tasks");
    return { success: true, message: "Task updated Successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function changeStatusOfTask(id: string, userId: string) {
  try {
    const task = await db.task.findUnique({
      where: {
        id: id,
      },
    });

    const currentUser = await auth();

    if (userId !== currentUser?.user?.id) {
      return { success: false, message: "You cant Update someones task" };
    }

    if (task?.status === "PENDING") {
      console.log(" in pending");
      await db.task.update({
        where: {
          id: id,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });
    } else if (task?.status === "IN_PROGRESS") {
      console.log(" in progress");

      await db.task.update({
        where: {
          id: id,
        },
        data: {
          status: "COMPLETED",
        },
      });
    } else {
      await db.task.update({
        where: {
          id: id,
        },
        data: {
          status: "PENDING",
        },
      });
    }
    revalidatePath("/tasks");
    revalidatePath("/");
    revalidatePath("/copyform/*");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUserDetails(formdata: any) {
  console.log(formdata, "result");
  try {
    const {
      role,
      name,
      contact,
      status,
      password,
      activeProject: activeProjectId,
      about,
      image,
    } = formdata;

    const userID = await auth();

    if (!userID) {
      return { success: false, message: "User is not authencticated" };
    }

    const data: Record<string, any> = {};

    if (role && role !== "") data.role = role as string;
    if (name && name !== "") data.name = name as string;
    if (contact && contact !== "") data.contact = contact as string;
    if (status && status !== "") data.status = status as string;
    if (about && about !== "") data.about = about as string;
    if (image && image !== "") data.image = image as string;
    if (activeProjectId && activeProjectId !== "") {
      let acitveP = await db.project.findFirst({
        where: { name: activeProjectId as string },
      });
      if (acitveP) {
        data.activeProjectId = acitveP?.id;
      } else {
        return { success: false, message: "No projects found with that name" };
      }
    }

    // Ensure there is data to update
    if (Object.keys(data).length === 0) {
      return { success: false, message: "No data to update" };
    }

    await db.user
      .update({
        where: { id: userID.user?.id },
        data,
      })
      .then((data) => {
        console.log(data);
        revalidatePath("/profile/*");
        revalidatePath("/edit");
        revalidatePath("/");
        return { success: true, message: "User data successfully updated" };
      })
      .catch((err) => {
        console.log(err);
        return { success: false, message: "Error while updating the user" };
      });
  } catch (error) {
    console.log(error);
    return { success: false, messsage: "Error while updating the user" };
  }
}

export async function createProject(prev: unknown, formdata: FormData) {
  const result = Object.fromEntries(formdata.entries());
  console.log(result, "result");
  try {
    const currentUser = await auth();
    if (!currentUser) {
      return { success: false, message: "User is not authenticated" };
    }
    const { client, name, status, startDate, endDate, description, githubLink } = result;

    let clientExist = await db.client.findFirst({
      where: {
        name: client as string,
        userId: currentUser?.user?.id,
      },
    });

    // If the client does not exist, create a new client
    if (!clientExist) {
      clientExist = await db.client.create({
        data: {
          name: client as string,
          userId: currentUser?.user?.id as string,
        },
      });
    }

    const project = await db.project
      .create({
        data: {
          name: name as string,
          endDate: new Date(endDate as string),
          startDate: new Date(startDate as string),
          userId: currentUser.user?.id as string,
          status: status as string,
          description: description as string,
          githubLink: githubLink as string,
          assignedUsers: {
            connect: [{ id: currentUser.user?.id }],
          },
          clients: {
            connect: [{ id: clientExist.id }],
          },
        },
      })
      .then((res) => {
        console.log(res);
        revalidatePath("/projects");
        revalidatePath("/profile/:userId");
        return { success: true, message: "Project created successfully" };
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error while creating project!" };
  }
}

export async function fetchProject() {
  try {
    const res = await db.project.findMany({});
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function assigneUsertoTheProject(id: string) {
  try {
    const user = await auth();

    if (!user?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Fetch the project with its assigned users
    const project = await db.project.findUnique({
      where: { id: id },
      include: { assignedUsers: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if the user is already assigned to the project
    const isUserAssigned = project.assignedUsers.some(
      (assignedUser) => assignedUser.id === user?.user?.id
    );

    // Toggle user assignment
    const updatedProject = await db.project.update({
      where: { id: id },
      data: {
        assignedUsers: isUserAssigned
          ? {
              disconnect: [{ id: user.user.id }],
            }
          : {
              connect: [{ id: user.user.id }],
            },
      },
    });

    console.log(updatedProject);
    revalidatePath("/projects/path*");
    return { success: true, message: "User Assigned SuccessFully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "User cant be Assigned " };
  }
}

export async function updateProjectDetails(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = Object.fromEntries(formData.entries());
  console.log(result, "result");

  try {
    const { name, status, startDate, endDate, description, githubLink } =
      result;
    const userid = await auth();

    if (
      !name ||
      name === "" ||
      !status ||
      status === "" ||
      !startDate ||
      startDate === "" ||
      !endDate ||
      endDate === "" ||
      !description ||
      description === "" ||
      !githubLink ||
      githubLink === ""
    ) {
      return { success: false, message: "Please fill all the field" };
    }

    const project = await db.project.findFirst({
      where: { userId: userid?.user?.id as string },
    });

    if (!project) {
      return {
        success: false,
        message: "You cant update someonelse's project",
      };
    }

    const updateProject = await db.project
      .update({
        where: { id: id },
        data: {
          name: name as string,
          status: status as string,
          endDate: new Date(endDate as string),
          startDate: new Date(startDate as string),
          description: description as string,
          githubLink: githubLink as string,
        },
      })
      .then((res) => {
        revalidatePath("/projects");
        return { success: true, message: "Project is successfully updated" };
      })
      .catch((err) => {
        console.log(err);
        return { success: false, message: "erro while updating the project" };
      });
  } catch (error) {
    console.log(error);
    return { success: false, message: "erro while updating the project" };
  }

  return;
}

export async function deleteProject(id: string) {
  await db.project.delete({ where: { id: id } });
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/tasks");
  redirect("/projects");
}
