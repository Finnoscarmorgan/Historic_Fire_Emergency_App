"use client";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "data", label: "Data sources" },
  { id: "map", label: "How the map works" },
  { id: "interpretation", label: "Interpreting results" },
  { id: "limitations", label: "Limitations" },
  { id: "credits", label: "Acknowledgements" }
];

export default function AboutPage() {
  return (
    <div className="bg-surface-50 text-brand-dark min-h-screen">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-8">
          About Historic Fires Near Me
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-10">

          {/* LEFT: Section Navigation */}
          <aside className="md:border-r md:border-surface-border md:pr-6">
            <div className="md:sticky md:top-24">

              <p className="text-xs font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                On this page
              </p>

              <nav className="space-y-1 text-sm">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block px-2 py-1 rounded hover:bg-surface-0 hover:text-brand-dark transition"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>

            </div>
          </aside>

          {/* RIGHT: Main Content */}
          <article className="space-y-14">

            <section id="overview">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Historic Fires Near Me visualises digitised newspaper reports of
                bushfires across Australia. Each mapped point corresponds to at least
                one article mentioning a fire event at that location and date.
              </p>
            </section>

            <section id="data">
              <h2 className="text-xl font-semibold mb-2">Data sources</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Data have been sourced from digitised newspapers available through Trove.
                Articles were identified using keyword searches and manually checked
                before being geo-located to the places mentioned.
              </p>
            </section>

            <section id="map">
              <h2 className="text-xl font-semibold mb-2">How the map works</h2>
              <p className="text-sm leading-relaxed text-gray-800 mb-2">
                The map uses deck.gl and MapLibre to cluster locations dynamically.
                As you zoom, clusters separate into individual points. The Results
                panel on the right lists all articles currently represented on the map.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Select clusters to filter results.</li>
                <li>Use the timeline to restrict the period shown.</li>
                <li>Use search to find towns or suburbs quickly.</li>
              </ul>
            </section>

            <section id="interpretation">
              <h2 className="text-xl font-semibold mb-2">Interpreting results</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                The map reflects reporting patterns rather than all fire events.
                Newspaper attention varies by region, population, editorial practices
                and availability of digitised material.
              </p>
            </section>

            <section id="limitations">
              <h2 className="text-xl font-semibold mb-2">Limitations</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Location accuracy varies across the dataset. Dates reflect publication
                rather than event occurrence. Some places have ambiguous historical
                names and have been normalised where possible.
              </p>
            </section>

            <section id="credits">
              <h2 className="text-xl font-semibold mb-2">Acknowledgements</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Data courtesy of Trove. Mapping developed using open-source tools
                including deck.gl and MapLibre.
              </p>
            </section>

          </article>

        </div>
      </main>
    </div>
  );
}
