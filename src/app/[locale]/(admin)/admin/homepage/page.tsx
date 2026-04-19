import prisma from "@/lib/prisma";
import { HomepageClient } from "./homepage-client";

export default async function AdminHomepagePage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return <HomepageClient sections={sections} />;
}
