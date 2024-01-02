import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../auth/[...thirdweb]";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  if (!user?.address) {
    return res.status(400).json({
      message: "With address string parse",
    });
  }
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        address: user.address,
      },
    });
    return res.status(200).json(findUser);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(400).json({ message: "Something went wrong" });
  }
};

export default handler;
