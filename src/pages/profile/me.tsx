import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getUser } from "../api/auth/[...thirdweb]";
import ProfileSection from "@/components/ProfilePage/ProfileSection";
import { User } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUser(ctx.req);

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        address: user.address,
        session: user.session || null,
        data: user.data,
      },
    },
  };
};

export default function ProfilePage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user;
  const data = JSON.parse(props.user.data) as User;

  return (
    <>
      <Head>
        <title>{`${data.name} - Profile`}</title>
      </Head>
      <ProfileSection />
    </>
  );
}
