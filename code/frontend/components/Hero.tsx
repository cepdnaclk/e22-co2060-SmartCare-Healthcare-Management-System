import Link from "next/link";
import { User } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex flex-row gap-75 bg-white text-black font-bold text-4xl">
        <div>
            <h1 className="pb-4">
                Your Health,
            </h1>
            <h1 className="">
                Our Priority.
            </h1>
            

        </div>
        <div>
         <Image src={/Hero.png} alt="Hero" width= ></Image>
        </div>
    </section>
      );
}
