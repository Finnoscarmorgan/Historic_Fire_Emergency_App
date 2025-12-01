// app/about/page.tsx
"use client";



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-0 text-gray-900">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">About</h1>

        <p className="mb-4 text-sm text-gray-700">
          This project visualises historical newspaper reports of bushfires across Australia.
          The interactive map allows you to filter articles by time, location and search terms,
          and to explore clusters of reporting activity.
        </p>

        <p className="mb-4 text-sm text-gray-700">
          Data are sourced from digitised newspapers and converted into a geo-referenced dataset.
          Each point on the map represents at least one article that mentions a fire event at that place and time.
        </p>

        <p className="mb-4 text-sm text-gray-700">
          Use the filters on the left to refine the timeline or search for specific towns, and
          select clusters on the map to view the underlying articles in the Results panel.
        </p>

        <p className="mt-8 text-xs text-gray-500">
          Built from Trove data.
        </p>
      </main>
    </div>
  );
}
