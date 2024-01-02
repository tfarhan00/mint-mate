import { getInitials } from "@/utils/strings";
import { cnm } from "@/utils/style";
import { User } from "@prisma/client";
import { useAddress, useConnectionStatus, useUser } from "@thirdweb-dev/react";
import Link from "next/link";

export default function ProfileUserCirlcle() {
  const { isLoggedIn, user } = useUser();
  const address = useAddress();
  const status = useConnectionStatus();

  if (!isLoggedIn || !address || !user || status === "disconnected")
    return null;

  const data = JSON.parse(user?.data as string) as User;

  const initialName = getInitials(data.name ?? "");

  return (
    <Link
      href={`/profile/me`}
      className={cnm(
        "w-8 aspect-square rounded-full flex items-center justify-center text-white text-xs",
        `bg-gradient-to-tr from-violet-400 to-violet-500`
      )}
    >
      {initialName}
    </Link>
  );
}
