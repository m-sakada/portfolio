import { getWorks, getExperiences, getSkills, getSettings } from '@/lib/microcms';
import Introduction from '@/components/sections/Introduction';
import WorksSection from '@/components/sections/WorksSection';
import ExperiencesSection from '@/components/sections/ExperiencesSection';
import SkillsSection from '@/components/sections/SkillsSection';
import { MicroCmsHtml } from '@/components/ui/MicroCmsHtml';

export default async function Home() {
  // Fetch data from microCMS (Server Component)
  const [works, experiences, skills, settings] = await Promise.all([
    getWorks(),
    getExperiences(),
    getSkills(),
    getSettings(),
  ]);

  return (
    <main className="min-h-screen">
      <Introduction 
        text={settings?.introductionMessage}
        profileImage={settings?.profileImage}
        name={settings?.name}
        nameEn={settings?.nameEn}
        mvImage={settings?.mvImage}
      />
      <WorksSection works={works} />
      <ExperiencesSection experiences={experiences} />
      <SkillsSection skills={skills} />
      {settings?.detailMessage && (
        <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <MicroCmsHtml 
              html={settings.detailMessage}
              className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl mx-auto"
            />
          </div>
        </section>
      )}
    </main>
  );
}
