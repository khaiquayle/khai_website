import FileSystemConsole from "@/components/FileSystemConsole";
import ProjectCard from "@/components/ProjectCard";
import StickyNav from "@/components/StickyNav";
import { Bot, Recycle, Warehouse } from "lucide-react";

const navLinks = [
  { href: "#console", label: "Console" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const experience = [
  {
    company: "Wells Fargo",
    role: "Incoming Technology Summer Intern",
    timeframe: "Summer 2026",
    meta: "Upcoming",
    summary:
      "Joining Wells Fargo this summer to contribute to engineering work in a production environment and continue growing as a software developer.",
  },
  {
    company: "Mercor",
    role: "Machine Learning Engineer (EPM)",
    timeframe: "Oct 2025 - Present",
    meta: "Part-time",
    summary:
      "Led technical operations across 5+ machine learning projects by defining system specifications, automating CI/CD workflows, and building LLM-as-a-Judge evaluation pipelines.",
  },
  {
    company: "Delta Air Lines",
    role: "Software/Data Engineering Co-op",
    timeframe: "Jan 2025 - May 2025",
    meta: "Atlanta, GA",
    summary:
      "Built internal Python tooling that reduced ULD ID processing time by 75%, developed a Tkinter interface for operational teams, and optimized 15+ Power BI dashboards by improving SQL queries and direct database connections.",
  },
];

const projects = [
  {
    icon: Recycle,
    title: "Sweepy iOS",
    summary:
      "A mobile app that helps users identify recyclable materials in real time.",
    details:
      "Sweepy captures acoustic signatures with frequency sweeps and uses on-device processing plus a classification model to simplify recycling decisions.",
    stack: "React Native, TensorFlow, Expo",
    contribution:
      "Designed the UI and UX in Figma and built the data collection and signal processing pipeline behind the classification flow.",
    repoLabel: "Private repo",
  },
  {
    icon: Warehouse,
    title: "Experimental Flights Inventory Management",
    summary:
      "A warehouse inventory platform designed to support drone-assisted inventory tracking.",
    details:
      "The system pairs a React frontend with backend inventory services so teams can monitor stock in real time and query data through a chatbot experience.",
    stack: "React, Material UI, Supabase, PostgreSQL",
    contribution:
      "Designed the database schema, implemented the inventory management system, and built a chatbot interface for interacting with live warehouse data.",
    repoLabel: "Private repo",
  },
  {
    icon: Bot,
    title: "Reddit LLM Persona Bot",
    summary:
      "A Reddit bot that generates in-character replies based on a creator's tone and style.",
    details:
      "The bot uses a custom LLM pipeline to analyze new subreddit posts, generate contextual replies, and maintain persistent reply state for reliable automation.",
    stack: "Python, OpenAI API, PRAW, Docker",
    contribution:
      "Built the automation pipeline, integrated the OpenAI and Reddit APIs, and set up persistent state tracking for stable cloud execution.",
    repoLabel: "View on GitHub",
    repoUrl: "https://github.com/khaiquayle/DQV_Reddit_Bot.git",
  },
];

const resumeHref = "/KhaiQuayle_Resume_2026_SWE.pdf";

const contactLinks = {
  email: "khaiquayle6@gmail.com",
  linkedin: "https://www.linkedin.com/in/khaiquayle",
  github: "https://github.com/khaiquayle/",
};

const consoleProjects = projects.map(
  ({ title, summary, details, stack, contribution, repoLabel, repoUrl }) => ({
    title,
    summary,
    details,
    stack,
    contribution,
    repoLabel,
    repoUrl,
  }),
);

export default function Homepage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.16),transparent_36%)] px-6 py-8 sm:py-12">
      <StickyNav
        brand="Khai Quayle | Developer"
        mobileBrand="Khai Quayle | Dev"
        links={navLinks}
      />

      <div className="mx-auto max-w-5xl space-y-12 pt-20 sm:space-y-16 sm:pt-12">
        <section
          id="top"
          className="rounded-3xl border border-white/10 bg-black/20 px-6 py-16 shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-20"
        >
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
              Atlanta-based builder
            </p>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Khai Quayle
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-neutral-300 sm:text-xl">
              Full-stack developer building web, mobile, and AI-powered
              applications with a focus on practical impact.
            </p>
            <p className="max-w-2xl text-base leading-7 text-neutral-400">
              I&apos;m especially interested in intelligent systems,
              human-centered product design, and software that reduces friction
              in everyday work.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <a
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100 sm:w-fit"
                href="#projects"
              >
                View Projects
              </a>
              <a
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-neutral-100 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5 sm:w-fit"
                href="#contact"
              >
                Contact Me
              </a>
              <a
                className="inline-flex w-full items-center justify-center rounded-full border border-amber-200/20 bg-amber-200/10 px-5 py-3 text-sm font-semibold text-amber-200 transition hover:-translate-y-0.5 hover:border-amber-200/35 hover:bg-amber-200/15 sm:w-fit"
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </div>
          </div>
        </section>

        <section
          id="console"
          className="space-y-6 rounded-3xl border border-white/10 bg-black/20 px-6 py-8 backdrop-blur sm:px-8"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold sm:text-3xl">Dev Console</h2>
            <p className="max-w-3xl text-base leading-8 text-neutral-300">
              Prefer exploring to reading? The shell below is a tiny filesystem
              version of my background. Start with <code className="rounded bg-white/5 px-1.5 py-0.5 text-sm text-neutral-100">ls</code> and follow
              the trail.
            </p>
          </div>

          <FileSystemConsole
            projects={consoleProjects}
            resumeHref={resumeHref}
            contact={contactLinks}
          />
        </section>

        <section
          id="education"
          className="rounded-3xl border border-white/10 bg-black/20 px-6 py-8 backdrop-blur sm:px-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-2xl font-bold sm:text-3xl">Education</h2>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200/80">
                Georgia Institute of Technology
              </p>
              <h3 className="text-xl font-semibold text-neutral-100 sm:text-2xl">
                B.S. in Computer Science
              </h3>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">
                Minor: Japanese
              </p>
              <p className="text-base leading-7 text-neutral-300">
                Student in the College of Computing.
              </p>
            </div>

            <div className="flex w-full min-w-0 flex-col items-center justify-center space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm md:w-auto md:min-w-44">
              <p className="font-semibold text-amber-200">Graduating 2026</p>
              <p className="text-neutral-400">Zell Miller Scholarship</p>
            </div>
          </div>
        </section>

        <section id="experience" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold sm:text-3xl">Experience</h2>
            <p className="max-w-2xl text-neutral-400">
              Roles where I&apos;ve worked on production systems, machine
              learning workflows, and internal tools that improve how teams
              operate.
            </p>
          </div>

          <div className="space-y-4">
            {experience.map((item) => (
              <article
                key={`${item.company}-${item.role}`}
                className="experience-card rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200/80">
                      {item.company}
                    </p>
                    <h3 className="text-xl font-semibold text-neutral-100 sm:text-2xl">
                      {item.role}
                    </h3>
                    <p className="max-w-3xl text-base leading-7 text-neutral-300">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex w-full min-w-0 flex-col items-center justify-center space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm md:w-auto md:min-w-44">
                    <p className="font-semibold text-amber-200">
                      {item.timeframe}
                    </p>
                    <p className="text-neutral-400">{item.meta}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold sm:text-3xl">My Projects</h2>
            <p className="max-w-2xl text-neutral-400">
              A few of the products and systems I&apos;ve built across mobile,
              web, and AI-driven workflows.
            </p>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                summary={project.summary}
                details={project.details}
                stack={project.stack}
                contribution={project.contribution}
                icon={project.icon}
                repoLabel={project.repoLabel}
                repoUrl={project.repoUrl}
              />
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-3xl border border-white/10 bg-black/20 px-6 py-8 backdrop-blur sm:px-8 sm:py-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
                Let&apos;s connect
              </p>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold sm:text-3xl">Contact Me</h2>
                <p className="text-base leading-7 text-neutral-300">
                  I&apos;m always open to interesting product, software, and
                  internship opportunities. If you&apos;re working on something
                  meaningful, I&apos;d be glad to hear about it.
                </p>
              </div>
            </div>

            <a
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100 sm:w-fit"
              href={`mailto:${contactLinks.email}`}
            >
              {contactLinks.email}
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <a
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
              href={`mailto:${contactLinks.email}`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                Email
              </p>
              <p className="mt-2 text-base font-semibold text-neutral-100">
                Send a message
              </p>
            </a>
            <a
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
              href={contactLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                LinkedIn
              </p>
              <p className="mt-2 text-base font-semibold text-neutral-100">
                Connect professionally
              </p>
            </a>
            <a
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
              href={contactLinks.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                GitHub
              </p>
              <p className="mt-2 text-base font-semibold text-neutral-100">
                Browse my code
              </p>
            </a>
          </div>
        </section>
        <section
          id="footer"
          className="rounded-3xl border border-white/10 bg-black/20 px-6 py-8 backdrop-blur sm:px-8 sm:py-10"
        >
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
            Made with Next.js and Tailwind
          </p>
          <p className="text-sm text-neutral-400">© 2026 Khai Quayle</p>
        </section>
      </div>
    </main>
  );
}