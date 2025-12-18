"use client";

import { useMemo, useState } from "react";

const items = [
  { id: "interpretation", label: "Interpreting results" },

  {
    id: "identifying",
    label: "Identifying bushfires",
    parent: "interpretation"
  },
  {
    id: "disambiguation",
    label: "Disambiguation heuristic for historical placenames",
    parent: "interpretation"
  },

  { id: "limitations", label: "Limitations" },
  { id: "credits", label: "Acknowledgements" }
];


export default function AboutPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(items[0].id);

  const togglePanel = () => setIsOpen(prev => !prev);

  const handleItemClick = id => {
    setActiveItem(id);
  };

  const itemById = useMemo(() => {
    const m = new Map();
    for (const it of items) m.set(it.id, it);
    return m;
  }, []);

  const getDepth = id => {
    let depth = 0;
    let cur = itemById.get(id);
    while (cur && cur.parent) {
      depth += 1;
      cur = itemById.get(cur.parent);
      if (depth > 5) break;
    }
    return depth;
  };

  return (
    <div className="bg-surface-50 text-brand-dark min-h-screen">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold mb-8">About Historic Fires Near Me</h1>

        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8 lg:gap-10">
          <aside className="md:border-r md:border-surface-border md:pr-6">
            <div className="md:sticky md:top-24 space-y-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                To help you explore
              </p>

              <div id="sidebar" aria-hidden="false" className="space-y-3">
                <h2 className="sr-only">Table of general information</h2>

                <div className="sidebar-wrapper" id="about-sidebar">
                  <p className="sidebar-title text-xs font-semibold text-gray-700 mb-1">
                    General information
                  </p>

                  <div className="panel panel-pgr-item top-level overflow-hidden border border-surface-border shadow-sm">
                    <div className="panel-heading bg-brand-dark text-white" role="tab">
                      <h4 className="panel-title">
                        <button
                          type="button"
                          onClick={togglePanel}
                          className="item-name w-full flex items-center justify-between px-3 py-2 text-left"
                          aria-expanded={isOpen}
                          aria-controls="collapse-general"
                        >
                          <div className="flex items-center gap-2">
                            <span className="hidden-expanded h-4 w-4 bg-brand-red" aria-hidden />
                            <span>General information</span>
                            <span className="sr-only">{isOpen ? "collapse" : "select to show"}</span>
                          </div>
                          <span className="expandable-wrapper" aria-hidden>
                            {isOpen ? "▲" : "▼"}
                          </span>
                        </button>
                      </h4>
                    </div>

                    <div
                      id="collapse-general"
                      className={[
                        "panel-collapse panel-collapse-menu-content bg-surface-0",
                        isOpen ? "block" : "hidden"
                      ].join(" ")}
                      role="tabpanel"
                      aria-expanded={isOpen}
                    >
                      <div className="panel-body" id="child-general">
                        {items.map(item => {
                          const isActive = activeItem === item.id;
                          const depth = getDepth(item.id);

                          const padClass =
                            depth === 0 ? "" : depth === 1 ? "pl-4 bg-surface-50/50" : "pl-8 bg-surface-50/50";

                          const textClass =
                            depth === 0 ? "font-medium" : depth === 1 ? "text-gray-700" : "text-gray-700 text-[13px]";

                          return (
                            <div
                              key={item.id}
                              className={[
                                "panel panel-pgr-item second-level border-t border-surface-border",
                                isActive ? "text-lhs-item-active bg-surface-50" : "bg-surface-0",
                                padClass
                              ].join(" ")}
                            >
                              <div className="panel-heading" role="tab">
                                <h4 className="panel-title">
                                  <a
                                    role="button"
                                    id={`link-general-${item.id}`}
                                    href={`#${item.id}`}
                                    className={["item-name block px-3 py-2 text-sm", textClass].join(" ")}
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
                </div>
              </div>
            </div>
          </aside>

          <article className="space-y-8">
            {/* Kept on the page, removed from the left menu */}
            <section id="overview">
              <div className="bg-surface-0 border border-surface-border p-5 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Overview</h2>
                  <p className="text-sm leading-relaxed text-gray-800">
                    <em>Historic Fires Near Me</em> visualises digitised newspaper reporting on bushfires across
                    Australia between 1850-1900. Each mapped point corresponds to at least one article mentioning a fire
                    event related to that location. 
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data sources</h3>
                  <p className="text-sm leading-relaxed text-gray-800">
                    Newspaper reporting was sourced from digitised newspapers available through{" "}
    <a
      href="http://trove.nla.gov.au/about/create-something/using-api"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-brand-dark hover:text-brand-red"
    >
      Trove
    </a>
    .  Relevant
    articles were identified using a keyword search for the term <em>bushfire</em>. Placenames
    surrounding this search term were extracted and geo-located using Named Entity Recognition (NER)
    and a custom geocoding algorithm built using infrastructure provided by the{" "}
    <a
      href="https://docs.tlcmap.org/help/developers/"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-brand-dark hover:text-brand-red"
    >
      Time Layered Cultural Map of Australia
    </a>
  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">How the map works</h3>
                  <p className="text-sm leading-relaxed text-gray-800 mb-3">
                    The map displays and clusters locations dynamically. At
                    lower zoom levels clusters indicate broad areas of reporting about historic fires. As you zoom in, clusters
                    separate into individual points. The Results panel on the right hand side lists the articles corresponding
                    to the currently visible points and filters. To interact with the map:
                  </p>

                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    <li>Select clusters to filter the Results panel to those articles.</li>
                    <li>Use the timeline to restrict the period displayed on the map.</li>
                    <li>Use the search box to locate towns or suburbs mentioned in reports.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="interpretation">
              <h2 className="text-xl font-semibold mb-2">Interpreting results</h2>
              <p className="text-sm leading-relaxed text-gray-800 mb-4">
                This map visualises patterns in historical newspaper reporting about bushfires, but it is not a complete record of every
                historic bushfire between 1850-1900. Reporting varies depending on population density, local news coverage, and
                editorial practices, so some areas appear more frequently than others. Locations shown on
                the map reflect placenames mentioned near the word <em>bushfire</em> in newspaper articles,
                rather than the exact sites of fires. In many cases, these locations represent nearby
                towns or communities that experienced, observed, or responded to fire events. The dates
                shown indicate when fires were reported, which may differ from when they occurred. 
                A structured process was developed to identify newspaper articles reporting bushfires
                and extract and geolocate relevant placenames. These steps are outlined below.
              </p>
            </section>

            <section id="identifying">
              <div className="rounded-lg border border-surface-border bg-surface-0 px-4 py-4 sm:px-5 sm:py-5 space-y-4">
                <h2 className="mt-0 font-bold text-center">Identifying bushfires</h2>
                <p className="text-sm leading-relaxed text-gray-800 mb-4">
                   The following steps outline the
                  workflow used to identify and isolate bushfire related content from the broader corpus of digitised
                  newspapers availabel on Trove.
                </p>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Build the corpus</p>
                    <p className="text-sm text-gray-800 mt-1">
                      The Trove API was used to collect digitised newspaper articles about bushfires between 1850-1900. This accomodates variations in spelling of the term <em>bushfire</em>. 
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Apply initial NER</p>
                    <p className="text-sm text-gray-800 mt-1">
                      The Stanford NER three class model was applied to extract PERSON, ORGANISATION and
                      LOCATION entities from the corpus. This established an initial set of prospective
                      placenames associated with reported bushfires.
                    </p>
                  </div>
                </div>

                  <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    3
                  </div>
                  
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Establish a context window</p>
                    
                    <p className="text-sm text-gray-800 mt-1">
                      A context window was defined around occurrences of the term <em>bushfire</em> to
                      capture placenames appearing in close descriptive proximity. A span of
                      approximately 600 characters was used to accommodate variations in article structure,
                      genre and nineteenth-century writing conventions.
                    </p>
                    <div className="mt-3 flex items-start gap-2 text-xs text-gray-700">
<img
  src="/icons/information_icon.png"
  alt="Information"
  className="h-4 w-4 mt-0.5 flex-shrink-0"
/>
<p>
  If you are using the dataset, please be aware of how variations in reporting
  impact accuracy across the century. Further methodological detail is available
  in the {" " }
  <a
    href="/data"
    className="underline text-brand-dark hover:text-brand-red"
  >
    data section </a>
  
  of this website. 
</p>

                  </div>
                </div>
                
</div>

                

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Apply relevance rules</p>
                    <p className="text-sm text-gray-800 mt-1">
                      Placenames that were too geographically broad to indicate a specific bushfire site, such as{" "}
                      <em>Australia</em>, were excluded. This removed generic or non informative
                      geographic references that would otherwise affect geolocation accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="disambiguation">
              <div className="rounded-lg border border-surface-border bg-surface-0 px-4 py-4 sm:px-5 sm:py-5 space-y-4">
                <h2 className="mt-0 font-bold text-center">
                  Disambiguation heuristic for historical placenames
                </h2>

               <p className="text-sm leading-relaxed text-gray-800 mb-4">
  A custom developed geocoding algorithm was developed to assign approximate coordinates to historical
  placenames while making uncertainty explicit. This was built using the{" "}
  <a
    href="https://tlcmap.org/?view=map"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-brand-dark hover:text-brand-red"
  >
    Gazetteer of Historical Australian Placenames
  </a>{" "}
  accessible through{" "}
  <a
    href="https://docs.tlcmap.org/help/developers/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-brand-dark hover:text-brand-red"
  >
    The Time Layered Cultural Map of Australia
  </a>
  . The heuristic detailed here avoids opaque selections from black 
                box geocoding services and explicitly encodes levels of uncertainty in the resulting dataset. The resulting 
                coordinates are therefore appropriate for analysing patterns in reported bushfires and for understanding 
                the geography of historical media reporting.
</p>



                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Retrieve all gazetteer entries</p>
                    <p className="text-sm text-gray-800 mt-1">
                      For each placename identified through Named Entity Recognition (NER), all corresponding historical entries were retrieved from the Gazetteer of Historical Australian Placenames (GHAP). These entries include colony or state, geographic class, and coordinates, and account for minor spelling variations in order to accommodate errors arising from Optical Character Recognition (OCR). As a result, some placenames may appear misspelt, as they are derived directly from Trove newspaper text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Identify the most likely colony</p>
                    <p className="text-sm text-gray-800 mt-1">
                      For each placename, the number of colonies in which it occurs was evaluated to establish
                       an <span className="font-semibold">above chance </span> threshold for geographic assignment. If a single colony exceeds this threshold,
                        it is selected for coordinate determination (for example two colonies → 50 per cent; five colonies → 20 per cent). 
                        If none exceeds it, the placename
                      is classified as <span className="font-semibold">ambiguous</span> and excluded from
                      automated geolocation.
                      
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">
                      Average coordinates within a single colony
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      When a single colony can be confidently assigned, surpassing the above chance threshold, the latitude and longitude values of all Gazetteer of Historical Australian Placenames (GHAP) entries for that placename within the colony are cumulatively aggregated and the mean values (average) are calculated to produce a single approximate coordinate. This coordinate represents a synthesis of all relevant entries rather than the selection of any individual gazetteer record.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">
                      Detect duplication within a colony
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      Distances between each GHAP coordinate and the mean coordinate are measured. The
                      median distance indicates whether multiple unrelated locations (such as common homestead names) share the same name within the same colony:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-800 mt-1 space-y-0.5">
                      <li>Median distance ≥ 1 degree → classified as ambiguous.</li>
                      <li>Median distance &lt; 1 degree → averaged coordinate retained.</li>
                    </ul>
                   
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    5
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">
                      Handle OCR and spelling variation
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      Historical newspapers contain OCR errors. Fuzzy matching
                      (Levenshtein distance) was lowered incrementally to match mispelled placenames with GHAP entries. Matches above
                      a defined similarity threshold were then then processed using the same steps as above.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    6
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Label ambiguous cases</p>
                    <p className="text-sm text-gray-800 mt-1">
                      A placename is formally treated as ambiguous if it cannot be assigned to a single
                      colony above chance, or if evidence indicates multiple distinct locations within one
                      colony. Ambiguous cases are flagged in the dataset and excluded from automated
                      spatial analysis unless manually resolved.
                    </p>
                  </div>
                </div>

                
              </div>
            </section>

            <section id="limitations">
              <h2 className="text-xl font-semibold mb-2">Limitations</h2>
              <p className="text-sm leading-relaxed text-gray-800">
                Location accuracy varies across the dataset. Locations shown on the map reflect placenames mentioned near the word bushfire in newspaper articles, rather than the exact sites of fires. Dates correspond to publication, not
                necessarily the exact time of the fire. The steps detailed above and the applied heuristic avoids opaque selections from black box geocoding services and
                      explicitly encodes levels of uncertainty in the dataset. The resulting coordinates are therefore appropriate
                      for analysing patterns in reported bushfires and for understanding the geography of
                      historical media reporting.
              </p>
            </section>

            <section id="credits">
  <h2 className="text-xl font-semibold mb-2">Acknowledgements</h2>

  <p className="text-sm leading-relaxed text-gray-800 mb-3">
    This project draws on a range of digital infrastructures, data sources, and software tools.
    The following resources were essential to the development of the dataset and methodology:
  </p>

  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
    <li>
      <a
        href="https://docs.tlcmap.org/about/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-brand-dark hover:text-brand-red"
      >
        Time Layered Cultural Map of Australia
      </a>
    </li>
    <li>
      <a
        href="https://trove.nla.gov.au"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-brand-dark hover:text-brand-red"
      >
        Trove, National Library of Australia
      </a>
    </li>
    <li>
      <a
        href="https://glam-workbench.net/trove-harvester/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-brand-dark hover:text-brand-red"
      >
        GLAM Workbench Trove Harvester
      </a>
    </li>
    <li>
      <a
        href="https://nlp.stanford.edu/software/CRF-NER.html"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-brand-dark hover:text-brand-red"
      >
        Stanford Named Entity Recognition (CRF-NER)
      </a>
    </li>
  </ul>
  <p className="text-sm leading-relaxed text-gray-800 mt-4">
    All source code used in this project is publicly available via the{" "}
    <a
      href="https://github.com/Finnoscarmorgan/Historical_Fires_Near_Me"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-brand-dark hover:text-brand-red"
    >
      Historical Fires Near Me GitHub repository
    </a>
    .
  </p>
</section>

          </article>
        </div>
      </main>
    </div>
  );
}
