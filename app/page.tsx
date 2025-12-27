import { getWorks, getExperiences, getSkills } from '@/lib/microcms';
import Introduction from '@/components/sections/Introduction';
import WorksSection from '@/components/sections/WorksSection';
import ExperiencesSection from '@/components/sections/ExperiencesSection';
import SkillsSection from '@/components/sections/SkillsSection';

export default async function Home() {
  // Fetch data from microCMS (Server Component)
  const [works, experiences, skills] = await Promise.all([
    getWorks(),
    getExperiences(),
    getSkills(),
  ]);

  return (
    <main className="min-h-screen">
      <Introduction />
      <WorksSection works={works} />
      <ExperiencesSection experiences={experiences} />
      <SkillsSection skills={skills} />
    </main>
  );
}
