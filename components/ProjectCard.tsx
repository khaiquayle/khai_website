import type { LucideIcon } from "lucide-react";

type ProjectCardProps = {
  title: string;
  summary: string;
  details: string;
  stack: string;
  contribution: string;
  icon: LucideIcon;
  repoLabel?: string;
  repoUrl?: string;
};

export default function ProjectCard({
  title,
  summary,
  details,
  stack,
  contribution,
  icon: Icon,
  repoLabel,
  repoUrl,
}: ProjectCardProps) {
  return (
    <article className="flip-card holographic-card h-full rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/10 transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-cyan-200/30 hover:shadow-2xl hover:shadow-cyan-500/10 sm:min-h-[31rem] md:min-h-[33rem]">
      <div className="flip-card-inner h-full">
        <div className="flip-card-face flip-card-front relative z-10 flex h-full flex-col rounded-2xl p-5 md:p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/70">
                Project
              </p>
              <h3 className="text-xl font-semibold text-amber-200 sm:text-2xl md:text-4xl">
                {title}
              </h3>
            </div>

            <p className="max-w-[24ch] text-sm leading-6 text-neutral-200 md:text-base md:leading-7">
              {summary}
            </p>
          </div>

          <div className="mt-8 space-y-4 sm:mt-auto sm:pt-8">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/20 bg-amber-200/5 shadow-lg shadow-amber-300/10">
                <Icon
                  className="h-7 w-7 text-amber-200 drop-shadow-[0_0_10px_rgba(253,224,71,0.35)]"
                  strokeWidth={1.8}
                />
              </div>
            </div>
            <div className="h-px w-full bg-white/10" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Stack
              </p>
              <p className="text-sm leading-6 text-neutral-300">{stack}</p>
            </div>
          </div>
        </div>

        <div className="flip-card-face flip-card-back relative z-10 flex h-full flex-col rounded-2xl p-5 md:p-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/70">
              Details
            </p>
            <h3 className="text-base font-semibold leading-tight text-amber-200 md:text-lg">
              {title}
            </h3>
          </div>

          <p className="mt-4 text-sm leading-5 text-neutral-200 md:leading-6">
            {details}
          </p>

          <div className="mt-auto space-y-2.5 pt-3">
            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                Stack
              </p>
              <p className="mt-1 text-sm text-neutral-300">{stack}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                What I built
              </p>
              <p className="mt-1 text-sm leading-5 text-neutral-300 md:leading-6">
                {contribution}
              </p>
            </div>

            {repoLabel ? (
              repoUrl ? (
                <a
                  className="inline-flex w-full items-center justify-center rounded-xl border border-amber-200/25 bg-amber-200/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-200/15"
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repoLabel}
                </a>
              ) : (
                <div className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-400">
                  {repoLabel}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
