import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Landing: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kennekt</title>
        <meta name="description" content="Kennekt with comrades" />
        <link rel="icon" href={"/logo.png"} />
      </Head>
      <main>Landing Page for Kennekt</main>
    </>
  );
};

export default Landing;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req as NextApiRequest, context.res as NextApiResponse)
  );

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
