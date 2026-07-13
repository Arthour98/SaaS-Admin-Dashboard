"use server";
import Image from "next/image";
import Footer from "@/components/partials/footer";
import Main from "@/components/partials/main";
import { redirect } from "next/navigation";
import CustomButton from "@/components/elements/customButton";
import { verifyRegistration } from "@/services/auth";
import { verifyJwtToken } from "@/lib/jwt";
import { cookies } from "next/headers";


 async function submitToken(formData: FormData) {
    "use server";

  const token = formData.get("verification-token")?.toString();

    const cookie_store = await cookies();
    const cookie_token = cookie_store.get("jwt-session")?.value;
    if(!cookie_token || !token)
    {
        throw new Error("Unauthorized");
    }
    const user = await verifyJwtToken(cookie_token);

    if (!user) {
    throw new Error("Unauthorized");
    }
    const user_id = user.payload.user_id;
    const result = await verifyRegistration(Number(user_id), token);

if (result.status === "success") {
    redirect("/dashboard");
  }
  throw new Error("Invalid verification token");
}

export default async function VerificationPage() {
  return (
    <>
      <header className="landingHeader">
        <div className="imageWrapper">
          <Image
            src="/images/dashboard_image.png"
            alt="dashboard"
            width={100}
            height={100}
          />
        </div>
        <p className="title">C-Board</p>
      </header>

      <Main className="verificationMain">
        <section className="flex justify-center w-full">
          <form
            id="verification-form"
            className="w-[80%]"
            action={submitToken}
          >
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-white">Enter Verification Code</h3>

              <input
                className="text-white w-[30%] border border-white"
                type="text"
                name="verification-token"
              />

              <CustomButton
                element="input"
                content="Submit"
                isLoading={false}
                className="text-white bg-orange-400 px-2 py-1 rounded-xl"
              />
            </div>
          </form>
        </section>
      </Main>

      <Footer />
    </>
  );
}