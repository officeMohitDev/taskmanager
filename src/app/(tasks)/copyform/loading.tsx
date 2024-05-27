import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Image
        src={"/images/spinner1.svg"}
        width={200}
        height={200}
        alt="spinner"
      />
    </div>
  );
};

export default loading;
