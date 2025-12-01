import { BudgetChart } from "@/components/BudgetChart";
import { CalendarWidget } from "@/components/CalendarWidget";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectProgress } from "@/components/ProjectProgress";
import { TeamSection } from "@/components/TeamSection";

const Page = () => {
    return (
        <>
            {/* Top row - Key metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-1">
                    <ProjectOverview />
                </div>
                <div className="lg:col-span-2">
                    <BudgetChart />
                </div>
            </div>

            {/* Middle row - Team and Calendar */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                <TeamSection />
                <CalendarWidget />
            </div>

            {/* Bottom row - Projects */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
                <ProjectProgress />
            </div>
        </>
    );
}

export default Page;