"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { GitFork, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const GITHUB_TOKEN = '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';

interface RepoData {
  title: string;
  description: string;
  forks: number;
  stars: number;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: readonly {
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  let [repoData, setRepoData] = useState<RepoData[]>([]);

  useEffect(() => {
    async function fetchRepoData() {
        const data = await Promise.all(
          items.map(async (item) => {
            // Extract the repository API URL from the provided link
            const repoUrl = item.link.replace("https://github.com/", "https://api.github.com/repos/");
            const response = await fetch(repoUrl, {
                headers: {
                  'Authorization': `token ${GITHUB_TOKEN}`, // Add the token here
                },
              });
              if (!response.ok) {
                throw new Error(`Failed to fetch ${repoUrl}`);
              }
            const repo = await response.json();
            return {
              title: repo.name,
              description: repo.description,
              forks: repo.forks_count,
              stars: repo.stargazers_count,
              
          };
        })
      );
      setRepoData(data);
    }

    fetchRepoData();
  }, [items]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 py-10",
        className
      )}
    >
      {repoData.map((data, idx) => (
        <Link
          href={items[idx]?.link}
          key={items[idx]?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>{data.description}</CardDescription>
            <CardFooter>
              <div className="flex items-center">
                <GitFork className="mr-1" /> {data.forks}
              </div>
              <div className="flex items-center ml-4">
                <Star className="mr-1" /> {data.stars}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white border-black/[0.2] dark:bg-black border  dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-900 dark:text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-700 dark:text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardFooter = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mt-8 text-zinc-700 dark:text-zinc-400 group-hover:text-green-500 tracking-wide leading-relaxed text-sm flex items-center",
        className
      )}
    >
      {children}
    </div>
  );
};
