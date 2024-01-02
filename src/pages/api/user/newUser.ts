import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../auth/[...thirdweb]";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const obj = JSON.parse(req.body);
  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        address: user.address,
      },
    });

    if (!findUser) {
      throw new Error("newUser.ts: User is not found");
    }

    if (!findUser.isNewUser) {
      throw new Error("newUser.ts: Is no longer new user");
    }

    const userData: { [key: string]: any } = {};

    if (obj.username) {
      userData.name = obj.username;
    }

    if (obj.email) {
      userData.email = obj.email;
    }

    if (typeof obj.isNewUser === "boolean") {
      userData.isNewUser = obj.isNewUser;
    }

    const updateUser = await prisma.user.update({
      where: {
        address: user.address,
      },
      data: userData,
    });

    return res.status(200).json({ message: "Success" });
  } catch (e: any) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Something went wrong",
    });
  }
};

export default handler;
