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

  
  { id: "research-outputs", label: "Research Outputs" },
  { id: "credits", label: "Acknowledgements" }
];


export default function AboutPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [researchOutputsOpen, setResearchOutputsOpen] = useState(false);
  const [identifyingOpen, setIdentifyingOpen] = useState(false);
  const [disambiguationOpen, setDisambiguationOpen] = useState(false);

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
  <div className="panel panel-pgr-item overflow-hidden border border-surface-border shadow-sm">

    <div className="panel-heading bg-brand-dark text-white">
      <h2 className="text-xl font-semibold px-4 py-3">
        Overview
      </h2>
    </div>

    <div className="panel-body bg-surface-0 px-5 py-5 space-y-5">
      <p className="text-sm leading-relaxed text-gray-800">
        <em>Historic Fires Near Me</em> visualises digitised newspaper reporting on bushfires
        across Australia between 1850 and 1900. Each mapped point corresponds to at least
        one newspaper article that mentions a fire event associated with that location.
      </p>

      <div>
        <h3 className="text-lg font-semibold mb-2">Data sources</h3>
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
          . Relevant articles were identified using a keyword search for the term{" "}
          <em>bushfire</em>. Placenames surrounding this search term were extracted and
          geolocated using Named Entity Recognition (NER) and a custom geocoding algorithm
          built using infrastructure provided by the{" "}
          <a
            href="https://docs.tlcmap.org/help/developers/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-brand-dark hover:text-brand-red"
          >
            Time Layered Cultural Map of Australia
          </a>
          .
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">How the map works</h3>
        <p className="text-sm leading-relaxed text-gray-800 mb-3">
          The map displays and clusters locations dynamically. At lower zoom levels,
          clusters indicate broader areas of reporting about historic fires. As users zoom
          in, clusters separate into individual points. The Results panel lists the
          articles corresponding to the currently visible points and applied filters.
        </p>

        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Select clusters to filter the Results panel to relevant articles.</li>
          <li>Use the timeline to restrict the period displayed on the map.</li>
          <li>Use the search box to locate towns or suburbs mentioned in reports.</li>
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-gray-800">
        Further information about the project, including background and methodology, is
        available on the project website:{" "}
        <a
          href="https://www.fiannualamorgan.com/historical-fires-near-me"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-brand-dark hover:text-brand-red"
        >
          fiannualamorgan.com/historical-fires-near-me
        </a>
        .
      </p>
    </div>
  </div>
</section>

<section id="interpretation">
  <div className="panel panel-pgr-item overflow-hidden border border-surface-border shadow-sm">

    <div className="panel-heading bg-brand-dark text-white">
      <h2 className="text-xl font-semibold px-4 py-3">
        Interpreting results
      </h2>
    </div>

    <div className="panel-body bg-surface-0 px-5 py-5 space-y-6">
      <p className="text-sm leading-relaxed text-gray-800">
        This map shows patterns in historical newspaper reporting about bushfires between
        1850 and 1900 and provides a valuable resource for understanding the history of fire
        in Australia. It does not constitute a complete or definitive record of all bushfires
        that occurred during this period.
      </p>

      <p className="text-sm leading-relaxed text-gray-800">
        Newspaper reporting changed substantially over the nineteenth century as populations
        grew, new technologies such as the steam train and the telegraph transformed how news
        was gathered and disseminated, and editorial practices evolved. As a result, some
        regions and time periods are more visible in the data than others.
      </p>

      <h3 className="text-sm font-semibold text-gray-900">
        Interpreting mapped locations and dates
      </h3>

      <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
        <li>
          Locations shown on the map are placenames that appear near the word{" "}
          <em>bushfire</em> in newspaper articles, not the precise sites where fires occurred.
        </li>
        <li>
          In many cases, these placenames refer to nearby towns or communities that reported on,
          were affected by, or responded to fire events.
        </li>
        <li>
          Dates associated with mapped points reflect when fires were reported in newspapers,
          not necessarily when the events themselves took place.
        </li>
      </ul>

      <p className="text-sm leading-relaxed text-gray-800">
        Despite these constraints, the dataset offers meaningful insight into the spatial and
        temporal dynamics of historical bushfire reporting and provides an important evidentiary
        base for fire history, environmental history, and media history research. The workflow
        used to construct the dataset is outlined below.
      </p>

      {/* Child panels grouped under the parent */}
      <div className="space-y-4 pt-2">
        {/* Identifying bushfires child panel */}
        <section id="identifying">
          <div className="panel panel-pgr-item overflow-hidden border border-surface-border/70 shadow-sm">

            <div className="panel-heading bg-brand-dark text-white" role="tab">
              <h3 className="text-base font-medium">
                <button
                  type="button"
                  onClick={() => setIdentifyingOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                  aria-expanded={identifyingOpen}
                  aria-controls="collapse-identifying"
                >
                  <span>Identifying bushfires</span>
                  <span className="text-xs" aria-hidden>
                    {identifyingOpen ? "▲" : "▼"}
                  </span>
                </button>
              </h3>
            </div>

            <div
              id="collapse-identifying"
              className={identifyingOpen ? "block" : "hidden"}
              role="tabpanel"
              aria-expanded={identifyingOpen}
            >
              <div className="panel-body bg-surface-0 px-5 py-5 space-y-5">
                <p className="text-sm leading-relaxed text-gray-800">
                  The following steps outline the workflow used to identify and isolate bushfire-related
                  content from the broader corpus of digitised newspapers available through Trove.
                </p>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Build the corpus</p>
                    <p className="text-sm text-gray-800 mt-1">
                      The Trove API was used to collect digitised newspaper articles about bushfires
                      between 1850 and 1900. This accommodates variations in spelling of the term{" "}
                      <em>bushfire</em>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Apply initial named entity recognition</p>
                    <p className="text-sm text-gray-800 mt-1">
                      The Stanford NER three-class model was applied to extract PERSON, ORGANISATION,
                      and LOCATION entities from the corpus, producing an initial set of prospective
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
                      capture placenames appearing in close descriptive proximity. A span of approximately
                      600 characters was used to accommodate variation in article structure, genre,
                      and nineteenth-century journalistic conventions.
                    </p>

                    <div className="mt-3 flex items-start gap-2 text-xs text-gray-700">
                      <img
                        src="/icons/information_icon.png"
                        alt="Information"
                        className="h-4 w-4 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        If you are using the dataset, please be aware that variations in reporting
                        practices affect accuracy across the period studied. Further methodological
                        detail is available in the{" "}
                        <a
                          href="/data"
                          className="underline text-brand-dark hover:text-brand-red"
                        >
                          data section
                        </a>{" "}
                        of this website.
                      </div>
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
                      Placenames that were too geographically broad to indicate a specific bushfire
                      location, such as <em>Australia</em>, were excluded to improve geolocation accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Disambiguation child panel */}
        <section id="disambiguation">
          <div className="panel panel-pgr-item overflow-hidden border border-surface-border/70 shadow-sm">

            <div className="panel-heading bg-brand-dark text-white" role="tab">
              <h3 className="text-base font-medium">
                <button
                  type="button"
                  onClick={() => setDisambiguationOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                  aria-expanded={disambiguationOpen}
                  aria-controls="collapse-disambiguation"
                >
                  <span>Disambiguation heuristic for historical placenames</span>
                  <span className="text-xs" aria-hidden>
                    {disambiguationOpen ? "▲" : "▼"}
                  </span>
                </button>
              </h3>
            </div>

            <div
              id="collapse-disambiguation"
              className={disambiguationOpen ? "block" : "hidden"}
              role="tabpanel"
              aria-expanded={disambiguationOpen}
            >
              <div className="panel-body bg-surface-0 px-5 py-5 space-y-5">
                <p className="text-sm leading-relaxed text-gray-800">
                  A custom-developed geocoding algorithm was used to assign approximate coordinates
                  to historical placenames while making uncertainty explicit. The heuristic draws on
                  the{" "}
                  <a
                    href="https://tlcmap.org/?view=map"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-brand-dark hover:text-brand-red"
                  >
                    Gazetteer of Historical Australian Placenames
                  </a>{" "}
                  provided through the{" "}
                  <a
                    href="https://docs.tlcmap.org/help/developers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-brand-dark hover:text-brand-red"
                  >
                    Time Layered Cultural Map of Australia
                  </a>
                  . This approach avoids opaque black-box geocoding services and explicitly encodes
                  uncertainty within the resulting dataset.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-dark">Retrieve all gazetteer entries</p>
                      <p className="text-sm text-gray-800 mt-1">
                        All historical gazetteer entries corresponding to each identified placename
                        were retrieved, including associated colony or state, geographic class, and
                        coordinates. Minor spelling variation was retained to accommodate OCR errors.
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
                        Colonies were evaluated using an above-chance threshold to determine whether
                        a single geographic context could be assigned. Placenames failing this test
                        were classified as ambiguous and excluded from automated geolocation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-dark">
                        Aggregate coordinates within a colony
                      </p>
                      <p className="text-sm text-gray-800 mt-1">
                        When a single colony could be confidently assigned, coordinates from all
                        matching gazetteer entries were averaged to produce a single approximate
                        location representing the placename.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-dark">
                        Detect duplication within colonies
                      </p>
                      <p className="text-sm text-gray-800 mt-1">
                        Median distance thresholds were used to identify cases where multiple unrelated
                        locations shared the same name within a single colony. Such cases were flagged
                        as ambiguous.
                      </p>
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
                        Fuzzy matching was applied incrementally to align misspelt placenames with
                        gazetteer entries, after which the same disambiguation steps were applied.
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
                        Placenames that could not be confidently resolved were flagged as ambiguous
                        and excluded from automated spatial analysis unless manually reviewed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  </div>
</section>




            

 <section id="research-outputs">
  <div className="panel panel-pgr-item overflow-hidden border border-surface-border shadow-sm bg-surface-0">
    <div className="panel-heading bg-brand-dark text-white">
      <button
        type="button"
        onClick={() => setResearchOutputsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={researchOutputsOpen}
        aria-controls="research-outputs-content"
      >
        <h2 className="text-xl font-semibold">Research Outputs</h2>
        <span
          aria-hidden
          className="text-xs font-semibold rounded-full border border-white/30 px-2 py-1"
        >
          {researchOutputsOpen ? "Hide" : "Show"}
        </span>
      </button>
    </div>

    <div
      id="research-outputs-content"
      className={researchOutputsOpen ? "block" : "hidden"}
    >
      <div className="panel-body px-5 py-5">
        <p className="text-sm leading-relaxed text-gray-800">
          Selected outputs associated with <em>Historic Fires Near Me</em>, grouped by type
          for ease of scanning.
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Public scholarship and media */}
          <section className="rounded-lg border border-surface-border bg-surface-0 p-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-brand-red"
                aria-hidden
              />
              Public scholarship and media
            </h3>

            <ul className="mt-3 space-y-3 text-sm text-gray-800">
              <li className="rounded-md bg-surface-50 p-3">
                <a
                  href="https://pursuit.unimelb.edu.au/individuals/fiannuala-morgan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-dark hover:text-brand-red"
                >
                  <em>
                    Dwyer, Graham and Fiannuala Morgan. “What 174 years of bushfire records teach us
                    about emergency management.”
                  </em>
                </a>
                <div className="mt-1 text-xs text-gray-700">Pursuit, June 2025.</div>
              </li>

              <li className="rounded-md bg-surface-50 p-3">
                <a
                  href="https://linktr.ee/tobecontinuedanu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-dark hover:text-brand-red"
                >
                  <em>Episode 2: Bushfires: To Be Continued.</em>
                </a>
                <div className="mt-1 text-xs text-gray-700">A Lost Literature Podcast, 2023.</div>
              </li>

              <li className="rounded-md bg-surface-50 p-3">
                <a
                  href="https://overland.org.au/previous-issues/issue-250/reading-ecological-decline-in-nineteenth-century-bushfire-serials-and-reporting/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-dark hover:text-brand-red"
                >
                  <em>Reading Ecological Decline in Nineteenth-Century Bushfire Serials and Reporting.</em>
                </a>
                <div className="mt-1 text-xs text-gray-700">Overland, 28 June 2023.</div>
              </li>

              <li className="rounded-md bg-surface-50 p-3">
                <a
                  href="https://theconversation.com/mythologised-memorialised-then-forgotten-a-history-of-australias-bushfire-reporting-170778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-dark hover:text-brand-red"
                >
                  <em>Mythologised, Memorialised Then Forgotten: A History of Australia’s Bushfire Reporting.</em>
                </a>
                <div className="mt-1 text-xs text-gray-700">The Conversation, 18 January 2022.</div>
              </li>
            </ul>
          </section>

          {/* Monographs */}
          <section className="rounded-lg border border-surface-border bg-surface-0 p-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-brand-red"
                aria-hidden
              />
              Monographs
            </h3>

            <ul className="mt-3 space-y-3 text-sm text-gray-800">
              <li className="rounded-md bg-surface-50 p-3">
                <em>Black Thursday and Other Lost Australian Bushfire Stories.</em>
                <div className="mt-1 text-xs text-gray-700">Canberra: Orbiter Publishing, 2021.</div>
              </li>
            </ul>
          </section>

          {/* Peer-reviewed scholarship */}
          <section className="rounded-lg border border-surface-border bg-surface-0 p-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-brand-red"
                aria-hidden
              />
              Peer-reviewed scholarship
            </h3>

            <ul className="mt-3 space-y-3 text-sm text-gray-800">
              <li className="rounded-md bg-surface-50 p-3">
                <a
                  href="https://doi.org/10.1111/1467-8500.70007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-dark hover:text-brand-red"
                >
                  <em>
                    Dwyer, G., Marjoribanks, T., Morgan, F., and Farmer, J. (2025). “Bushfire public inquiries:
                    From recommendations to hybrid emergency management arrangements.”
                  </em>
                </a>
                <div className="mt-1 text-xs text-gray-700">
                  <em>Australian Journal of Public Administration</em>, 1:40.
                </div>
              </li>
            </ul>
          </section>

          {/* Funding and Awards */}
          <section className="rounded-lg border border-surface-border bg-surface-0 p-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-brand-red"
                aria-hidden
              />
              Funding and awards
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-gray-800">
              <li className="rounded-md bg-surface-50 p-3">
                Chief Investigator and Inaugural Recipient of the Melbourne Public Humanities Initiative for{" "}
                <em>
                  Historical Fire Records as Community Data: Digitisation, Co-Design, and Climate Research
                </em>
                , Faculty of Arts, The University of Melbourne.
              </li>
              <li className="rounded-md bg-surface-50 p-3">
                Joint recipient of the Climate Research Accelerator (CRX), Melbourne Climate Futures (MCF’s) funding
                scheme, 2023, in collaboration with the FLARE research group, University of Melbourne.
              </li>
              <li className="rounded-md bg-surface-50 p-3">
                Awarded Graduate Digital Research Fellowship, Queensland University of Technology, 2021.
              </li>
              <li className="rounded-md bg-surface-50 p-3">
                Research Partner, 2021 ARDC Grant, <em>Time Layered Cultural Map of Australia: Dark Places</em>.
              </li>
            </ul>
          </section>
        </div>

        {/* Presentations */}
        <section className="mt-6 rounded-lg border border-surface-border bg-surface-0 p-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full bg-brand-red"
              aria-hidden
            />
            Presentations and invited talks
          </h3>

          <ul className="mt-3 space-y-3 text-sm text-gray-800">
            <li className="rounded-md bg-surface-50 p-3">
              Digital Spatial Memories Panel. Panel presented by Fiannuala Morgan, Francesca Sidoti, Heather Ford,
              Claire Loughnan and Michael Falk at <em>Digital Humanities Australasia 2025</em>, Australian National
              University, Canberra, Roland Wilson Building, Seminar Room 3, 3 to 5 December 2025.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>Simple Algorithms, Big Discoveries: Using NLP to Unlock Digital Cultural Collections.</em> Creative
              Technologist Lecture with SLV Lab, State Library of Victoria, Public Lecture, 9 October 2025.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>Mapping Histories and Writers: The Role of NLP in Enhancing Archival Work.</em> NSW Branch of the
              Australian Society of Archivists, 3 April 2024.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <a
                href="https://vimeo.com/showcase/11221722?video=958187585#chapter=15347171"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand-dark hover:text-brand-red"
              >
                <em>Historical Fires Near Me: (Re)Constructing Colonial Ecological Records.</em>
              </a>
              <div className="mt-1 text-xs text-gray-700">
                Lightning talk, Making Meaning 2024: Collections as Data, State Library of Queensland, 8 March 2024.
              </div>
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>Trove Research Webinar.</em> Co-presented with Kate Ross, National Library of Australia, 31 August
              2023.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>
                Latent Geographic Associations: Theorising Mapping in Journalistic and Fictional Accounts of
                Nineteenth-Century Bushfires.
              </em>{" "}
              Conversations in HADES seminar series, The University of Melbourne, 19 May 2022.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>Space, Data, Place: Digital Tools for Australia’s Deep Past.</em> Centre for Environmental History,
              Australian National University, 23 August 2022.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>Rethinking Settler (Un)Belonging: Reading Ecological Decline in Colonial Australian Literature.</em>{" "}
              Coming to Terms, 30 Years On: The Mabo Legacy in Australian Writing, University of Tasmania, 4 July 2022.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>Bushfire Literature and Reporting: Mythology, Memorialisation and Omission.</em> ResBaz Research
              Bazaar, The University of Queensland, 26 November 2021.
            </li>
            <li className="rounded-md bg-surface-50 p-3">
              <em>
                Geo-locating Real and Fictional Place: Analysis of Bushfires in Australian Literature and Newspaper
                Articles.
              </em>{" "}
              National School of Arts Winter Seminar Series, Teaching and Researching in the Digital Humanities, 24 June
              2021.
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</section>



           <section id="credits">
  <div className="panel panel-pgr-item overflow-hidden border border-surface-border shadow-sm">

    <div className="panel-heading bg-brand-dark text-white">
      <h2 className="text-xl font-semibold px-4 py-3">
        Acknowledgements
      </h2>
    </div>

    <div className="panel-body bg-surface-0 px-5 py-5 space-y-4">
      <p className="text-sm leading-relaxed text-gray-800">
        This project draws on a range of digital infrastructures, data sources, and software
        tools. The resources listed below were essential to the development of the dataset
        and the methodological approach.
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

      <p className="text-sm leading-relaxed text-gray-800 pt-2">
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
    </div>
  </div>
</section>



          </article>
        </div>
      </main>
    </div>
  );
}
