function DashboardSkeleton() {
  return (
    <section className="bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto flex h-52 flex-col items-center justify-center px-6 py-8 lg:py-0">
        <div className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
            <div className="flex items-center gap-5">
              <div className="h-10 w-48 animate-pulse bg-gray-300 text-2xl font-semibold text-neutral-900 dark:text-white" />
            </div>
            <div>
              <div className="w-full animate-pulse rounded border bg-gray-300 px-3 py-2" />
              <div className="mt-3 w-full animate-pulse rounded border bg-gray-300 px-3 py-2" />
              <div className="mt-3 w-full animate-pulse rounded border bg-gray-300 px-3 py-2" />
              <div className="mt-3 w-full animate-pulse rounded border bg-gray-300 px-3 py-2" />
              <div className="mt-3 w-full animate-pulse rounded border bg-gray-300 px-3 py-2" />
              <div className="mt-3 w-full animate-pulse rounded border bg-gray-300 px-3 py-2" />
            </div>
            <div className="my-5 max-h-64 space-y-2">
              <div className="h-12 w-full animate-pulse rounded bg-gray-300" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-300" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-300" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-300" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-300" />
            </div>
            <div className="h-12 w-full animate-pulse rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardSkeleton;
