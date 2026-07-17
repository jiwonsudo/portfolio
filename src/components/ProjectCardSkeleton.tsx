/** ProjectCard와 같은 형태의 로딩 스켈레톤 */
export default function ProjectCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white"
    >
      <div className="aspect-4/3 animate-pulse bg-neutral-100" />
      <div className="flex flex-col gap-2.5 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
        <div className="mt-1 h-3 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
