import { getTenantFromHeaders } from "@/lib/tenant-server";
import { RepStandingHero } from "@/components/marketing/repstanding-hero";
import { PerceptionMirrorHero } from "@/components/marketing/perception-mirror-hero";

export default async function Home() {
  const tenant = await getTenantFromHeaders();

  if (tenant === "perception_mirror") {
    return <PerceptionMirrorHero />;
  }

  return <RepStandingHero />;
}
