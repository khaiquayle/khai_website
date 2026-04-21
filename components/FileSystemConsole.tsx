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

type FileSystemConsoleProps = {
  projects: ConsoleProject[];
  resumeHref: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
};

type FsPath = string[];

type HistoryEntry = {
  path: FsPath;
  command: string;
  output: ReactNode | null;
};

type FsFile = {
  type: "file";
  render: () => ReactNode;
};

type FsDir = {
  type: "dir";
  entries: Record<string, FsNode>;
};

type FsNode = FsFile | FsDir;

type TableRow = {
  label: string;
  value: ReactNode;
};

type CommandResult = {
  output: ReactNode | null;
  nextPath?: FsPath;
};

const PROMPT_USER = "khai@portfolio";
const GUIDE_FILENAME = "README.txt";
const SHELL_COMMANDS = ["ls", "cd", "cat", "pwd", "clear"];

const ROOT_COMMANDS = [
  "ls",
  "cat README.txt",
  "cat bio.txt",
  "cd projects",
  "cat contact.txt",
];

const PROJECT_COMMANDS = [
  "ls",
  "cat sweepy.txt",
  "cat experimental.txt",
  "cat reddit-bot.txt",
  "cd ..",
];

const README_ROWS: TableRow[] = [
  { label: "ls", value: "list files in the current directory" },
  { label: "ls -a", value: "include hidden files" },
  { label: "cd <dir>", value: "change directories" },
  { label: "cat <file>", value: "print a file" },
  { label: "pwd", value: "show the current path" },
  { label: "Tab", value: "autocomplete commands and files" },
  { label: "clear", value: "clear the terminal" },
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

function toProjectFileName(title: string) {
  switch (toProjectKey(title)) {
    case "sweepy-ios":
      return "sweepy.txt";
    case "experimental-flights-inventory-management":
      return "experimental.txt";
    case "reddit-llm-persona-bot":
      return "reddit-bot.txt";
    default:
      return `${toProjectKey(title)}.txt`;
  }
}

function formatPath(path: FsPath) {
  return path.length === 0 ? "~" : `~/${path.join("/")}`;
}

function formatPrompt(path: FsPath) {
  return `${PROMPT_USER} ${formatPath(path)} %`;
}

function parsePath(currentPath: FsPath, rawTarget?: string) {
  if (!rawTarget || rawTarget.trim() === "") {
    return [...currentPath];
  }

  const target = rawTarget.trim();
  if (target === "~" || target === "/") {
    return [];
  }

  const nextPath =
    target.startsWith("/") || target.startsWith("~") ? [] : [...currentPath];

  const trimmedTarget = target.startsWith("~/")
    ? target.slice(2)
    : target.startsWith("/")
      ? target.slice(1)
      : target.startsWith("~")
        ? ""
        : target;

  for (const segment of trimmedTarget.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      if (nextPath.length > 0) {
        nextPath.pop();
      }
      continue;
    }

    nextPath.push(segment);
  }

  return nextPath;
}

function findChildEntry(directory: FsDir, segment: string) {
  return Object.entries(directory.entries).find(
    ([name]) => name.toLowerCase() === segment.toLowerCase(),
  );
}

function resolveNode(root: FsDir, path: FsPath) {
  let current: FsNode = root;
  const canonicalPath: FsPath = [];

  for (const segment of path) {
    if (current.type !== "dir") {
      return { node: null, canonicalPath };
    }

    const child = findChildEntry(current, segment);
    if (!child) {
      return { node: null, canonicalPath };
    }

    canonicalPath.push(child[0]);
    current = child[1];
  }

  return { node: current, canonicalPath };
}

function baseName(path: FsPath) {
  return path[path.length - 1] ?? "~";
}

function PromptLine({
  path,
  command,
  children,
}: {
  path: FsPath;
  command?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-x-3 gap-y-1 break-words text-neutral-100">
      <span className="shrink-0 text-cyan-300">{formatPrompt(path)}</span>
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

function OutputTable({ rows }: { rows: TableRow[] }) {
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
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.endsWith(".pdf");

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

function sortNames(a: string, b: string) {
  const left = a.toLowerCase();
  const right = b.toLowerCase();

  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return a.localeCompare(b);
}

function DirectoryListing({
  entries,
}: {
  entries: Array<[string, FsNode]>;
}) {
  return (
    <div className="inline-grid grid-cols-1 gap-x-20 gap-y-1.5 min-[440px]:grid-cols-[max-content_max-content] md:grid-cols-[max-content_max-content_max-content]">
      {[...entries].sort(([left], [right]) => sortNames(left, right)).map(([name, node]) => (
        <span
          key={name}
          className={node.type === "dir" ? "text-cyan-200" : "text-neutral-300"}
        >
          {node.type === "dir" ? `${name}/` : name}
        </span>
      ))}
    </div>
  );
}

function CompletionList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-500">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export default function FileSystemConsole({
  projects,
  resumeHref,
  contact,
}: FileSystemConsoleProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentPath, setCurrentPath] = useState<FsPath>([]);
  const [completionOutput, setCompletionOutput] = useState<ReactNode | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileSystem = useMemo<FsDir>(() => {
    const projectEntries: Record<string, FsNode> = {};

    for (const project of projects) {
      projectEntries[toProjectFileName(project.title)] = {
        type: "file",
        render: () => (
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
        ),
      };
    }

    return {
      type: "dir",
      entries: {
        [GUIDE_FILENAME]: {
          type: "file",
          render: () => (
            <div className="space-y-3">
              <OutputText className="font-semibold text-neutral-100">
                {GUIDE_FILENAME}
              </OutputText>
              <OutputText>
                This console is a tiny filesystem version of my background. Start
                with <span className="text-cyan-200">ls</span>, then{" "}
                <span className="text-cyan-200">cat bio.txt</span> or{" "}
                <span className="text-cyan-200">cd projects</span>.
              </OutputText>
              <OutputText className="text-neutral-500">
                Run <span className="text-cyan-200">ls -a</span> if you like
                surprises.
              </OutputText>
              <OutputTable rows={README_ROWS} />
            </div>
          ),
        },
        "bio.txt": {
          type: "file",
          render: () => (
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
          ),
        },
        "impact.txt": {
          type: "file",
          render: () => (
            <div className="space-y-1.5 text-neutral-300">
              <OutputText>
                - Reduced manual ULD ID processing by 75% at Delta by building a
                standalone Python tool.
              </OutputText>
              <OutputText>
                - Cut dashboard refresh times by about 50% across 15+ Power BI
                dashboards by refactoring SQL and using a direct database
                connection.
              </OutputText>
              <OutputText>
                - Built mobile, full-stack, and AI-assisted tools across
                analytics, automation, and product work.
              </OutputText>
            </div>
          ),
        },
        "education.txt": {
          type: "file",
          render: () => (
            <OutputTable
              rows={[
                { label: "school", value: "Georgia Institute of Technology" },
                { label: "degree", value: "B.S. in Computer Science" },
                { label: "minor", value: "Japanese" },
                { label: "graduating", value: "Dec 2026" },
                { label: "gpa", value: "3.97" },
                { label: "scholarship", value: "Zell Miller" },
              ]}
            />
          ),
        },
        "experience.txt": {
          type: "file",
          render: () => (
            <div className="space-y-1.5 text-neutral-300">
              <OutputText>
                - Wells Fargo — Incoming Technology Summer Intern (Summer 2026)
              </OutputText>
              <OutputText>
                - Mercor — Machine Learning Engineer (EPM), leading technical
                operations across 5+ ML projects.
              </OutputText>
              <OutputText>
                - Delta Air Lines — Software/Data Engineering Co-op, where I
                built internal Python tooling and optimized 15+ dashboards.
              </OutputText>
            </div>
          ),
        },
        "skills.txt": {
          type: "file",
          render: () => (
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
          ),
        },
        "currently.txt": {
          type: "file",
          render: () => (
            <div className="space-y-1.5 text-neutral-300">
              <OutputText>
                - Building this site by hand to sharpen my frontend fundamentals.
              </OutputText>
              <OutputText>
                - Interested in AI, human-centered product design, and useful
                internal tools.
              </OutputText>
              <OutputText>
                - Focused on shipping software with both technical depth and
                product sense.
              </OutputText>
            </div>
          ),
        },
        "contact.txt": {
          type: "file",
          render: () => (
            <OutputTable
              rows={[
                {
                  label: "email",
                  value: (
                    <TerminalLink href={`mailto:${contact.email}`}>
                      {contact.email}
                    </TerminalLink>
                  ),
                },
                {
                  label: "linkedin",
                  value: (
                    <TerminalLink href={contact.linkedin}>
                      linkedin.com/in/khaiquayle
                    </TerminalLink>
                  ),
                },
                {
                  label: "github",
                  value: (
                    <TerminalLink href={contact.github}>
                      github.com/khaiquayle
                    </TerminalLink>
                  ),
                },
              ]}
            />
          ),
        },
        projects: {
          type: "dir",
          entries: projectEntries,
        },
        "resume.pdf": {
          type: "file",
          render: () => (
            <div className="space-y-1.5">
              <OutputText>PDF preview omitted in terminal.</OutputText>
              <TerminalLink href={resumeHref}>open resume PDF</TerminalLink>
            </div>
          ),
        },
        ".secret": {
          type: "file",
          render: () => (
            <div className="space-y-1.5">
              <OutputText>Here&apos;s my cat.</OutputText>
              <pre className="overflow-x-auto text-amber-200/90">
                {SECRET_CAT_ASCII}
              </pre>
            </div>
          ),
        },
      },
    };
  }, [projects, contact, resumeHref]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const output = outputRef.current;
    if (!output) {
      return;
    }

    output.scrollTop = output.scrollHeight;
  }, [history, completionOutput]);

  const makeError = (message: string, hint?: ReactNode): CommandResult => ({
    output: (
      <div className="space-y-1.5">
        <OutputText className="text-rose-300">{message}</OutputText>
        {hint ? <OutputText className="text-neutral-500">{hint}</OutputText> : null}
      </div>
    ),
  });

  const getCurrentDirectory = () => {
    const { node } = resolveNode(fileSystem, currentPath);
    return node?.type === "dir" ? node : fileSystem;
  };

  const getAutocompleteItems = (kind: "dir" | "file", prefix: string) => {
    const directory = getCurrentDirectory();
    const normalizedPrefix = prefix.toLowerCase();
    const items = Object.entries(directory.entries)
      .filter(([, node]) => node.type === kind)
      .map(([name]) => name)
      .filter((name) => {
        if (!prefix.startsWith(".") && name.startsWith(".")) {
          return false;
        }

        return name.toLowerCase().startsWith(normalizedPrefix);
      })
      .sort(sortNames);

    if (kind === "dir") {
      if ("..".startsWith(prefix) || prefix === "") {
        items.unshift("..");
      }

      if ("~".startsWith(prefix) || prefix === "") {
        items.unshift("~");
      }
    }

    return Array.from(new Set(items));
  };

  const showCompletionOptions = (items: string[]) => {
    if (items.length === 0) {
      setCompletionOutput(null);
      return;
    }

    setCompletionOutput(<CompletionList items={items} />);
  };

  const handleAutocomplete = () => {
    const value = input;
    const trimmedStart = value.trimStart();

    if (!trimmedStart) {
      showCompletionOptions(SHELL_COMMANDS);
      return;
    }

    const hasTrailingSpace = /\s$/.test(value);
    const firstSpace = trimmedStart.indexOf(" ");
    const command =
      firstSpace === -1
        ? trimmedStart.toLowerCase()
        : trimmedStart.slice(0, firstSpace).toLowerCase();

    if (firstSpace === -1 && !hasTrailingSpace) {
      const matches = SHELL_COMMANDS.filter((item) =>
        item.startsWith(trimmedStart.toLowerCase()),
      );

      if (matches.length === 1) {
        const match = matches[0];
        const needsArg = match === "cd" || match === "cat";
        setInput(needsArg ? `${match} ` : match);
        setCompletionOutput(null);
        return;
      }

      showCompletionOptions(matches);
      return;
    }

    const argsString =
      firstSpace === -1 ? "" : trimmedStart.slice(firstSpace + 1).trimStart();

    if (argsString.includes(" ")) {
      setCompletionOutput(null);
      return;
    }

    if (command === "cd") {
      const prefix = hasTrailingSpace ? "" : argsString;
      const matches = getAutocompleteItems("dir", prefix);

      if (matches.length === 1) {
        setInput(`cd ${matches[0]}`);
        setCompletionOutput(null);
        return;
      }

      showCompletionOptions(matches);
      return;
    }

    if (command === "cat") {
      const prefix = hasTrailingSpace ? "" : argsString;
      const matches = getAutocompleteItems("file", prefix);

      if (matches.length === 1) {
        setInput(`cat ${matches[0]}`);
        setCompletionOutput(null);
        return;
      }

      showCompletionOptions(matches);
      return;
    }

    setCompletionOutput(null);
  };

  const executeCommand = (rawCommand: string, path: FsPath): CommandResult => {
    const trimmed = rawCommand.trim();
    const [commandToken] = trimmed.split(/\s+/);
    const command = commandToken.toLowerCase();
    const argsString = trimmed.slice(commandToken.length).trim();

    switch (command) {
      case "ls": {
        const rawArgs = argsString ? argsString.split(/\s+/).filter(Boolean) : [];
        let showHidden = false;
        const pathArgs: string[] = [];

        for (const arg of rawArgs) {
          if (arg.startsWith("-")) {
            for (const flag of arg.slice(1)) {
              if (flag === "a") {
                showHidden = true;
              } else if (flag !== "l") {
                return makeError(`ls: unsupported option -- ${flag}`);
              }
            }
          } else {
            pathArgs.push(arg);
          }
        }

        if (pathArgs.length > 1) {
          return makeError("ls: too many arguments");
        }

        const targetPath = parsePath(path, pathArgs[0] ?? ".");
        const { node, canonicalPath } = resolveNode(fileSystem, targetPath);

        if (!node) {
          return makeError(`ls: ${pathArgs[0] ?? "."}: no such file or directory`);
        }

        if (node.type === "file") {
          return {
            output: (
              <DirectoryListing entries={[[baseName(canonicalPath), node]]} />
            ),
          };
        }

        const entries = Object.entries(node.entries).filter(
          ([name]) => showHidden || !name.startsWith("."),
        );

        return {
          output:
            entries.length > 0 ? (
              <DirectoryListing entries={entries} />
            ) : (
              <OutputText className="text-neutral-500">
                directory is empty
              </OutputText>
            ),
        };
      }

      case "cd": {
        const target = argsString || "~";
        const nextPath = parsePath(path, target);
        const { node, canonicalPath } = resolveNode(fileSystem, nextPath);

        if (!node) {
          return makeError(`cd: ${target}: no such file or directory`);
        }

        if (node.type !== "dir") {
          return makeError(`cd: ${target}: not a directory`);
        }

        return {
          output: null,
          nextPath: canonicalPath,
        };
      }

      case "cat": {
        if (!argsString) {
          return makeError(
            "cat: missing file operand",
            <>
              try <span className="text-cyan-200">cat README.txt</span>
            </>,
          );
        }

        const targetPath = parsePath(path, argsString);
        const { node } = resolveNode(fileSystem, targetPath);

        if (!node) {
          return makeError(`cat: ${argsString}: no such file or directory`);
        }

        if (node.type === "dir") {
          return makeError(`cat: ${argsString}: is a directory`);
        }

        return {
          output: node.render(),
        };
      }

      case "pwd":
        return {
          output: <OutputText>{formatPath(path)}</OutputText>,
        };

      default:
        return makeError(
          `command not found: ${rawCommand}`,
          <>
            start with <span className="text-cyan-200">ls</span> or{" "}
            <span className="text-cyan-200">cat {GUIDE_FILENAME}</span>
          </>,
        );
    }
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) {
      return;
    }

    setCompletionOutput(null);

    const normalized = normalizeCommand(command);
    if (normalized === "clear") {
      setHistory([]);
      setInput("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return;
    }

    const pathAtRun = [...currentPath];
    const result = executeCommand(command, pathAtRun);

    setHistory((current) => [
      ...current,
      {
        path: pathAtRun,
        command,
        output: result.output,
      },
    ]);

    if (result.nextPath) {
      setCurrentPath(result.nextPath);
    }

    setInput("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const hint =
    currentPath[0] === "projects" ? (
      <>
        you are in <span className="text-cyan-200">~/projects</span>. try{" "}
        <span className="text-cyan-200">ls</span> or{" "}
        <span className="text-cyan-200">cat sweepy.txt</span>
      </>
    ) : (
      <>
        new here? start with <span className="text-cyan-200">ls</span>, then{" "}
        <span className="text-cyan-200">cat {GUIDE_FILENAME}</span>
      </>
    );

  const suggestedCommands =
    currentPath[0] === "projects" ? PROJECT_COMMANDS : ROOT_COMMANDS;

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
                    <OutputText className="text-neutral-500">{hint}</OutputText>
                  </div>
                </div>
              ) : null}

              {history.map((entry, index) => (
                <div
                  key={`${entry.command}-${index}`}
                  className="space-y-3"
                >
                  <PromptLine
                    path={entry.path}
                    command={entry.command}
                  />
                  {entry.output}
                </div>
              ))}

              {completionOutput ? <div className="space-y-3">{completionOutput}</div> : null}

              <div className="pt-1">
                <label
                  className="sr-only"
                  htmlFor="file-system-console-input"
                >
                  Terminal input
                </label>
                <PromptLine path={currentPath}>
                  <input
                    id="file-system-console-input"
                    ref={inputRef}
                    className="min-w-[12ch] flex-1 bg-transparent text-neutral-100 caret-cyan-300 outline-none placeholder:text-neutral-600"
                    type="text"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      if (completionOutput) {
                        setCompletionOutput(null);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        runCommand(input);
                        return;
                      }

                      if (event.key === "Tab") {
                        event.preventDefault();
                        handleAutocomplete();
                      }
                    }}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </PromptLine>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestedCommands.map((command) => (
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
