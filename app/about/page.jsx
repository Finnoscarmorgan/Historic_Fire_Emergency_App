"use client";

import { useState } from "react";

const groups = [
  {
    id: "current",
    title: "Current content",
    items: [
      { id: "overview", label: "Overview" },
      { id: "data", label: "Data sources" },
      { id: "map", label: "How the map works" }
    ]
  },
  {
    id: "general",
    title: "General information",
    items: [
      { id: "interpretation", label: "Interpreting results" },
      { id: "limitations", label: "Limitations" },
      { id: "credits", label: "Acknowledgements" }
    ]
  }
];

export default function AboutPage() {
  const [openPanel, setOpenPanel] = useState(groups[0].id);
  const [activeItem, setActiveItem] = useState(groups[0].items[0].id);

  const togglePanel = id => {
    setOpenPanel(prev => (prev === id ? null : id));
  };

  const handleItemClick = id => {
    setActiveItem(id);
    // allow the anchor to scroll to the section
  };

  return (
    <div className="bg-surface-50 text-brand-dark min-h-screen">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-8">
          About Historic Fires Near Me
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8 lg:gap-10">
          {/* LEFT: Sidebar with collapsible panels */}
          <aside className="md:border-r md:border-surface-border md:pr-6">
            <div className="md:sticky md:top-24 space-y-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                To help you explore
              </p>

              <div
                id="sidebar"
                aria-hidden="false"
                className="space-y-3"
              >
                <h2 className="sr-only">
                  Table of current information
                </h2>

                <div className="sidebar-wrapper" id="about-sidebar">
                  <p className="sidebar-title text-xs font-semibold text-gray-700 mb-1">
                    Project information
                  </p>

                  <div className="space-y-2">
                    {groups.map(group => {
                      const isOpen = openPanel === group.id;
                      return (
                        <div
                          key={group.id}
                          className={[
                            "panel panel-pgr-item top-level rounded-lg overflow-hidden border border-surface-border shadow-sm",
                            isOpen ? "panel-pgr-item-expanded" : ""
                          ].join(" ")}
                        >
                          {/* Panel heading */}
                          <div className="panel-heading bg-brand-dark text-white" role="tab">
                            <h4 className="panel-title">
                              <button
                                type="button"
                                onClick={() => togglePanel(group.id)}
                                className="item-name w-full flex items-center justify-between px-3 py-2 text-left"
                                aria-expanded={isOpen}
                                aria-controls={`collapse-${group.id}`}
                              >
                                <div className="flex items-center gap-2">
                                  {/* Small icon block as visual marker */}
                                  <span
                                    className="hidden-expanded h-4 w-4 rounded bg-brand-red"
                                    aria-hidden
                                  />
                                  <span>{group.title}</span>
                                  <span className="sr-only">
                                    {isOpen ? "collapse" : "select to show"}
                                  </span>
                                </div>
                                <span className="expandable-wrapper" aria-hidden>
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </button>
                            </h4>
                          </div>

                          {/* Panel body (collapsible) */}
                          <div
                            id={`collapse-${group.id}`}
                            className={[
                              "panel-collapse panel-collapse-menu-content bg-surface-0",
                              isOpen ? "block" : "hidden"
                            ].join(" ")}
                            role="tabpanel"
                            aria-expanded={isOpen}
                          >
                            <div className="panel-body" id={`child-${group.id}`}>
                              {group.items.map(item => {
                                const isActive = activeItem === item.id;
                                return (
                                  <div
                                    key={item.id}
                                    className={[
                                      "panel panel-pgr-item second-level border-t border-surface-border",
                                      isActive ? "text-lhs-item-active bg-surface-50" : "bg-surface-0"
                                    ].join(" ")}
                                  >
                                    <div className="panel-heading" role="tab">
                                      <h4 className="panel-title">
                                        <a
                                          role="button"
                                          id={`link-${group.id}-${item.id}`}
                                          href={`#${item.id}`}
                                          className="item-name block px-3 py-2 text-sm"
                                          aria-selected={isActive}
                                          onClick={() => handleItemClick(item.id)}
                                        >
                                          <span>{item.label}</span>
                                          <span className="sr-only">
                                            {isActive ? " currently showing" : " select to show"}
                                          </span>
                                        </a>
                                      </h4>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Main content */}
          <article className="space-y-8">
            <section id="overview">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Historic Fires Near Me visualises digitised newspaper reports of
                bushfires across Australia. Each mapped point corresponds to at least
                one article mentioning a fire event at that location and date. The map
                is intended as a tool for exploring patterns of reporting rather than
                as a definitive catalogue of all fire incidents.
              </p>
            </section>

            <section id="data">
              <h2 className="text-xl font-semibold mb-2">Data sources</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Data have been sourced from digitised newspapers available through
                Trove. Articles were identified using keyword searches and manually
                reviewed before being geo-located to the places mentioned. Location
                names have been normalised where possible, but some historical names
                remain.
              </p>
            </section>

            <section id="map">
              <h2 className="text-xl font-semibold mb-2">How the map works</h2>
              <p className="text-sm leading-relaxed text-gray-800 mb-2">
                The map uses deck.gl and MapLibre to display and cluster locations
                dynamically. At lower zoom levels clusters indicate broad areas of
                reporting. As you zoom in, clusters separate into individual points.
                The Results panel lists the articles corresponding to the currently
                visible points and filters.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Select clusters to filter the Results panel to those articles.</li>
                <li>Use the timeline to restrict the period displayed on the map.</li>
                <li>Use the search box to locate towns or suburbs mentioned in reports.</li>
              </ul>
            </section>

            <section id="interpretation">
              <h2 className="text-xl font-semibold mb-2">Interpreting results</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                The visualisation reflects patterns in newspaper reporting, not a
                complete record of all fires. Reporting is influenced by population
                density, editorial priorities, the availability of correspondents and
                many other social and institutional factors.
              </p>
            </section>

            <section id="limitations">
              <h2 className="text-xl font-semibold mb-2">Limitations</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Location accuracy varies across the dataset. Dates correspond to
                publication, not necessarily the exact time of the fire. Some
                historical place names are ambiguous, and in those cases broader
                locality references have been used.
              </p>
            </section>

            <section id="credits">
              <h2 className="text-xl font-semibold mb-2">Acknowledgements</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Data courtesy of Trove. Mapping developed using open-source tools
                including deck.gl and MapLibre. You can adapt this section to include
                institutional affiliations, funding acknowledgements and community
                partners.
              </p>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
