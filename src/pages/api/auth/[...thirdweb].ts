import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { NextApiRequest } from "next";
import prisma from "@/lib/prisma";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  callbacks: {
    onLogin: saveUserToDB,
    onUser: async (user) => {
      const populateUser = await prisma.user.findUnique({
        where: {
          address: user.address,
        },
      });
      return JSON.stringify(populateUser);
    },
  },
  cookieOptions: {
    sameSite: "strict",
  },
});

async function saveUserToDB(address: string, req: NextApiRequest) {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        address,
      },
    });

    if (!findUser) {
      await prisma.user.create({
        data: {
          address: address,
        },
      });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "production") return;
    console.error(e, "Error while finding or create user");
  }
}

export default ThirdwebAuthHandler;
