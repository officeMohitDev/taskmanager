"use client";
import { updateUserDetails } from "@/actions";
import { app } from "@/lib/firebase";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Project, User } from "@prisma/client";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const statuss = [
  {
    label: "Busy",
    value: "Busy",
  },
  {
    label: "Free",
    value: "Free",
  },
  {
    label: "On Vacation",
    value: "onVacation",
  },
];

const PersonalDetailsFrom = ({
  data,
  projectData,
}: {
  data: User | null;
  projectData: Project[];
}) => {
  const [name, setName] = useState(data?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(data?.role || "");
  const [contact, setContact] = useState(data?.contact || "");
  const [selectedStatus, setSelectedStatus] = useState("Busy");
  // const [currentProject, setCurrentProject] = useState("");
  const [activeProject, setActiveProject] = useState("");
  const [about, setAbout] = useState(data?.about || "");
  const [imageLink, setImageLink] = useState("");
  const fileref = useRef<any>(null);
  const [file, setFile] = useState<any | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [setUploadError, setSetUploadError] = useState<any>(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: any) => {
    setIsLoading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageLink(downloadUrl);
          toast.success("File Uploaded!");
          setIsLoading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  console.log(imageLink);

  return data ? (
    <div>
      <form
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          await updateUserDetails({
            name,
            role,
            contact,
            about,
            image: imageLink,
            status: selectedStatus,
            activeProject,
          })
            .then((res) => {
              toast.success("User Profile Updated successfully");
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            })
            .finally(() => setIsLoading(false));
        }}
        className="flex flex-col md:flex-row md:items-start gap-7"
      >
        <div className="w-full mt-4 flex items-center justify-center md:items-start md:justify-start md:w-fit">
          <input
            type="file"
            hidden
            name="file"
            ref={fileref}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
            className="rounded-full"
            accept="images/*"
          />

          {imageLink ? (
            <input
              onClick={() => fileref.current.click()}
              type="image"
              name="image"
              src={imageLink || "/images/noprofile"}
              alt="profile"
              width={120}
              className="rounded-full object-cover"
              height={120}
            />
          ) : (
            <img
              onClick={() => fileref.current.click()}
              src={data?.image || "/images/noprofile.jpg"}
              alt="profile"
              width={120}
              height={120}
              className="rounded-full cursor-pointer"
            />
          )}
        </div>
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="flex gap-3">
            <Input
              name="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              name="role"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Input
              label="Phone number"
              type="text"
              name="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact as string}
            />
            <Select
              label="Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              name="status"
              disabled={!!statuss.length}
            >
              {statuss.map((c) => (
                <SelectItem key={c.label} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-3">
            <Input label="Password" name="password" />
            <Select
              label="Current Project"
              name="activeProject"
              disabled={!!statuss.length}
              onChange={(e) => setActiveProject(e.target.value)}
            >
              {projectData.map((c) => (
                <SelectItem key={c.name as string} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Textarea
            name="about"
            label="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <Button disabled={isLoading} color="secondary" type="submit">
            Update
          </Button>
        </div>
      </form>
    </div>
  ) : (
    <h1>No data</h1>
  );
};

export default PersonalDetailsFrom;
