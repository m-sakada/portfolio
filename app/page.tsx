import { getWorks, getCareer, getSkills, getSettings } from '@/lib/microcms';
import Introduction from '@/components/sections/Introduction';
import WorksSection from '@/components/sections/WorksSection';
import CareerSection from '@/components/sections/CareerSection';
import SkillsSection from '@/components/sections/SkillsSection';
import { MicroCmsHtml } from '@/components/ui/MicroCmsHtml';

export default async function Home() {
  // Fetch data from microCMS (Server Component)
  const [works, career, skills, settings] = await Promise.all([
    getWorks(),
    getCareer(),
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
      <CareerSection career={career} />
      <SkillsSection skills={skills} />
      {settings?.detailMessage && (
        <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-300">
          <div className="max-w-4xl mx-auto">
            <MicroCmsHtml html={settings.detailMessage} />
          </div>
        </section>
      )}
    </main>
  );
}
