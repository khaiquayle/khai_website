"use client";

import { JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type ConsoleProject = {
  title: string;
  summary: string;
  details: string;
  stack: string;
  contribution: string;
  repoLabel?: string;
  repoUrl?: string;
};

type DevConsoleProps = {
  projects: ConsoleProject[];
  resumeHref: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
};

const PROMPT = "khai@portfolio ~ %";
const SUGGESTED_COMMANDS = [
  "help",
  "whoami",
  "impact",
  "projects",
  "currently",
  "contact",
];

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const DEFAULT_KQ_ASCII_ROWS = [
  { text: "##     ##      #######", className: "text-rose-300" },
  { text: "##    ##      ##     ##", className: "text-orange-300" },
  { text: "##   ##       ##     ##", className: "text-amber-200" },
  { text: "######        ##     ##", className: "text-lime-300" },
  { text: "##   ##       ##   # ##", className: "text-cyan-300" },
  { text: "##    ##      ##    ####", className: "text-violet-300" },
  { text: "##     ##      ####### ##", className: "text-neutral-100" },
].map((row) => ({
  ...row,
  text: row.text.replace(/\s+$/, ""),
}));

const SECRET_CAT_ASCII = [
  "           __..--''``---....___   _..._    __",
  " /// //_.-'    .-/\";  `        ``<._  ``.''_ `. / // /",
  "///_.-' _..--.'_    \\                    `( ) ) // //",
  "/ (_..-' // (< _     ;_..__               ; `' / ///",
  " / // // //  `-._,_)' // / ``--...____..-' /// / //",
].join("\n");

function normalizeCommand(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function toProjectKey(value: string) {
  return normalizeCommand(value)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function PromptLine({
  command,
  children,
}: {
  command?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-x-3 gap-y-1 break-words text-neutral-100">
      <span className="shrink-0 text-cyan-300">{PROMPT}</span>
      {children ?? (command ? <span>{command}</span> : null)}
    </div>
  );
}

function OutputText({
  children,
  className = "text-neutral-300",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}

function OutputTable({
  rows,
}: {
  rows: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-neutral-300">
      {rows.map((row) => (
        <div
          key={row.label}
          className="contents"
        >
          <span className="text-amber-200">{row.label}</span>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function TerminalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const isExternal =
    href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf");

  return (
    <a
      className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-100 hover:decoration-cyan-200"
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

export default function DevConsole({
  projects,
  resumeHref,
  contact,
}: DevConsoleProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const projectMap = useMemo(() => {
    const entries = projects.map((project) => [toProjectKey(project.title), project] as const);
    return new Map(entries);
  }, [projects]);

  useEffect(() => {
    const output = outputRef.current;
    if (!output) return;

    output.scrollTop = output.scrollHeight;
  }, [history]);

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;

    const normalized = normalizeCommand(command);

    if (normalized === "clear") {
      setHistory([]);
      setInput("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return;
    }

    if (normalized === "resume") {
      window.open(resumeHref, "_blank", "noopener,noreferrer");
    }

    setHistory((current) => [...current, command]);
    setInput("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const resolveProject = (query: string) => {
    const aliases: Record<string, string> = {
      sweepy: "sweepy-ios",
      "sweepy-ios": "sweepy-ios",
      experimental: "experimental-flights-inventory-management",
      flights: "experimental-flights-inventory-management",
      "experimental-flights": "experimental-flights-inventory-management",
      reddit: "reddit-llm-persona-bot",
      "reddit-bot": "reddit-llm-persona-bot",
      "reddit-llm": "reddit-llm-persona-bot",
    };

    const key = aliases[toProjectKey(query)] ?? toProjectKey(query);
    return projectMap.get(key);
  };

  const renderOutput = (rawCommand: string) => {
    const normalized = normalizeCommand(rawCommand);

    if (
      normalized === "cat .secret" ||
      normalized === "cat ~/.secret" ||
      normalized === "secret"
    ) {
      return (
        <div className="space-y-1.5">
          <OutputText>Here&apos;s my cat.</OutputText>
          <pre className="overflow-x-auto text-amber-200/90">
            {SECRET_CAT_ASCII}
          </pre>
        </div>
      );
    }

    const [command, ...args] = normalized.split(" ");

    switch (command) {
      case "help":
        return (
          <OutputTable
            rows={[
              { label: "whoami", value: "quick intro" },
              { label: "impact", value: "quantified wins" },
              { label: "education", value: "school + credentials" },
              { label: "skills", value: "tools and technologies" },
              { label: "projects", value: "list featured projects" },
              { label: "project", value: "inspect one project" },
              { label: "currently", value: "what I am focused on right now" },
              { label: "contact", value: "ways to reach me" },
              { label: "resume", value: "open resume PDF" },
              { label: "clear", value: "clear the console" },
            ]}
          />
        );
      case "about":
      case "whoami":
        return (
          <div className="space-y-1.5">
            <OutputText className="font-semibold text-neutral-100">
              Khai Quayle
            </OutputText>
            <OutputText>
              Georgia Tech CS student building software that is both technically
              strong and actually useful.
            </OutputText>
            <OutputText>
              I am especially interested in AI, product-minded engineering, and
              tools that reduce friction in real workflows.
            </OutputText>
          </div>
        );
      case "impact":
        return (
          <div className="space-y-1.5 text-neutral-300">
            <OutputText>- Reduced manual ULD ID processing by 75% at Delta by building a standalone Python tool.</OutputText>
            <OutputText>- Cut dashboard refresh times by about 50% across 15+ Power BI dashboards by refactoring SQL and using a direct database connection.</OutputText>
            <OutputText>- Built mobile, full-stack, and AI-assisted tools across analytics, automation, and product work.</OutputText>
          </div>
        );
      case "education":
        return (
          <OutputTable
            rows={[
              { label: "school", value: "Georgia Institute of Technology" },
              { label: "degree", value: "B.S. in Computer Science" },
              { label: "minor", value: "Japanese" },
              { label: "graduating", value: "Dec 2026" },
              { label: "gpa", value: "3.96" },
              { label: "scholarship", value: "Zell Miller" },
            ]}
          />
        );
      case "skills":
        return (
          <OutputTable
            rows={[
              {
                label: "languages",
                value: "Python, Java, TypeScript, JavaScript, SQL, C",
              },
              {
                label: "frontend",
                value: "React, Next.js, Tailwind CSS, React Native",
              },
              {
                label: "backend",
                value: "PostgreSQL, Supabase, REST APIs, OpenAI API",
              },
              {
                label: "tooling",
                value: "Docker, Git, Power BI, Pandas, NumPy, Tkinter",
              },
            ]}
          />
        );
      case "projects":
        return (
          <div className="space-y-3">
            <OutputTable
              rows={[
                {
                  label: "sweepy",
                  value: "cross-platform material identification app",
                },
                {
                  label: "experimental",
                  value: "inventory tooling with an AI-assisted query flow",
                },
                {
                  label: "reddit-bot",
                  value: "containerized LLM persona bot",
                },
              ]}
            />
            <OutputText className="text-neutral-500">
              run <span className="text-cyan-200">project &lt;name&gt;</span> for
              more detail
            </OutputText>
          </div>
        );
      case "project": {
        const query = args.join(" ");
        if (!query) {
          return (
            <div className="space-y-1.5">
              <OutputText className="text-rose-300">
                usage: project &lt;name&gt;
              </OutputText>
              <OutputText className="text-neutral-500">
                try: project sweepy
              </OutputText>
            </div>
          );
        }

        const project = resolveProject(query);

        if (!project) {
          return (
            <div className="space-y-1.5">
              <OutputText className="text-rose-300">
                project not found: {query}
              </OutputText>
              <OutputText className="text-neutral-500">
                try: project sweepy, project experimental, or project reddit-bot
              </OutputText>
            </div>
          );
        }

        return (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <OutputText className="font-semibold text-neutral-100">
                {project.title}
              </OutputText>
              <OutputText>{project.summary}</OutputText>
            </div>
            <OutputTable
              rows={[
                { label: "stack", value: project.stack },
                { label: "details", value: project.details },
                { label: "built", value: project.contribution },
                {
                  label: "repo",
                  value: project.repoUrl ? (
                    <TerminalLink href={project.repoUrl}>
                      {project.repoLabel ?? "Open repository"}
                    </TerminalLink>
                  ) : (
                    project.repoLabel ?? "Available on request"
                  ),
                },
              ]}
            />
          </div>
        );
      }
      case "currently":
        return (
          <div className="space-y-1.5 text-neutral-300">
            <OutputText>- Building this site by hand to sharpen my frontend fundamentals.</OutputText>
            <OutputText>- Interested in AI, human-centered product design, and useful internal tools.</OutputText>
            <OutputText>- Focused on shipping software with both technical depth and product sense.</OutputText>
          </div>
        );
      case "contact":
        return (
          <OutputTable
            rows={[
              {
                label: "email",
                value: <TerminalLink href={`mailto:${contact.email}`}>{contact.email}</TerminalLink>,
              },
              {
                label: "linkedin",
                value: <TerminalLink href={contact.linkedin}>linkedin.com/in/khaiquayle</TerminalLink>,
              },
              {
                label: "github",
                value: <TerminalLink href={contact.github}>github.com/khaiquayle</TerminalLink>,
              },
              {
                label: "resume",
                value: <TerminalLink href={resumeHref}>open resume PDF</TerminalLink>,
              },
            ]}
          />
        );
      case "resume":
        return (
          <div className="space-y-1.5">
            <OutputText>opening resume...</OutputText>
            <TerminalLink href={resumeHref}>open in new tab</TerminalLink>
          </div>
        );
      default:
        return (
          <div className="space-y-1.5">
            <OutputText className="text-rose-300">
              command not found: {rawCommand}
            </OutputText>
            <OutputText className="text-neutral-500">
              type <span className="text-cyan-200">help</span> to see available
              commands
            </OutputText>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`${jetbrainsMono.className} overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#06080c]/95 shadow-2xl shadow-black/20`}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            khai@portfolio - dev console
          </p>
          <span className="w-12" />
        </div>

        <div className="bg-[#0a0e14]">
          <div
            ref={outputRef}
            className="h-[18rem] overflow-y-auto px-4 py-4 text-[13px] leading-6 sm:h-[22rem] sm:px-5 sm:py-5 sm:text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="space-y-6">
              {history.length === 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <div className="relative inline-block">
                      <pre
                        aria-hidden
                        className="pointer-events-none absolute left-1 top-1 m-0 whitespace-pre text-[11px] leading-[1.05] tracking-[0.08em] text-white/10 sm:text-[13px] sm:tracking-[0.12em]"
                      >
                        {DEFAULT_KQ_ASCII_ROWS.map((row) => row.text).join("\n")}
                      </pre>
                      <pre className="relative m-0 whitespace-pre text-[11px] leading-[1.05] tracking-[0.08em] sm:text-[13px] sm:tracking-[0.12em]">
                        {DEFAULT_KQ_ASCII_ROWS.map((row) => (
                          <span
                            key={row.text}
                            className={`block ${row.className}`}
                          >
                            {row.text}
                          </span>
                        ))}
                      </pre>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <OutputText className="text-neutral-400">
                      welcome to khai&apos;s console
                    </OutputText>
                    <OutputText className="text-neutral-500">
                      hint: type <span className="text-cyan-200">help</span> or
                      tap a command below
                    </OutputText>
                  </div>
                </div>
              ) : null}

              {history.map((command, index) => (
                <div
                  key={`${command}-${index}`}
                  className="space-y-3"
                >
                  <PromptLine command={command} />
                  {renderOutput(command)}
                </div>
              ))}

              <form
                className="pt-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  runCommand(input);
                }}
              >
                <label
                  className="sr-only"
                  htmlFor="dev-console-input"
                >
                  Dev console input
                </label>
                <PromptLine>
                  <input
                    id="dev-console-input"
                    ref={inputRef}
                    className="min-w-[12ch] flex-1 bg-transparent text-neutral-100 caret-cyan-300 outline-none placeholder:text-neutral-600"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder=""
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </PromptLine>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            onClick={() => runCommand(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
