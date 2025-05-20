import FindDogs from "@/components/FindDogs";
import { Suspense } from "react";

export const metadata = {
    title: "Fetch Dogs | Find Dogs"
}

const Page = () => {
  return (
    <Suspense>
      <FindDogs />
    </Suspense>
  );
};

export default Page;
