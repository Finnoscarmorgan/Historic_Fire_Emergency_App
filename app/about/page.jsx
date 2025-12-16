"use client";

import { useState } from "react";

const items = [
  { id: "overview", label: "Overview" },
  { id: "data", label: "Data sources" },
  { id: "map", label: "How the map works" },
  { id: "interpretation", label: "Interpreting results" },
  { id: "limitations", label: "Limitations" },
  { id: "credits", label: "Acknowledgements" }
];

export default function AboutPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(items[0].id);

  const togglePanel = () => setIsOpen(prev => !prev);

  const handleItemClick = id => {
    setActiveItem(id);
    // normal anchor behaviour will scroll to the section
  };

  return (
    <div className="bg-surface-50 text-brand-dark min-h-screen">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page title */}
        <h1 className="text-3xl font-semibold mb-8">
          About Historic Fires Near Me
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8 lg:gap-10">
          {/* LEFT: single collapsible “General information” panel */}
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

                  <div className="panel panel-pgr-item top-level rounded-lg overflow-hidden border border-surface-border shadow-sm">
                    {/* Panel heading */}
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
                            <span
                              className="hidden-expanded h-4 w-4 rounded bg-brand-red"
                              aria-hidden
                            />
                            <span>General information</span>
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

                    {/* Panel body: links to all sections */}
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
                                    id={`link-general-${item.id}`}
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
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: main content sections */}
          <article className="space-y-8">
            <section id="overview">
  <div className="bg-surface-0 border border-surface-border rounded-lg p-5">
    <h2 className="text-xl font-semibold mb-2">Overview</h2>
    <p className="text-sm leading-relaxed text-gray-800">
      Historic Fires Near Me visualises digitised newspaper reports of bushfires
      across Australia. Each mapped point corresponds to at least one article
      mentioning a fire event at that location and date. The map is intended as a
      tool for exploring patterns of reporting rather than as a definitive
      catalogue of all fire incidents.
    </p>
  </div>
</section>

<section id="data">
  <div className="bg-surface-0 border border-surface-border rounded-lg p-5">
    <h2 className="text-xl font-semibold mb-2">Data sources</h2>
    <p className="text-sm leading-relaxed text-gray-800">
      Data have been sourced from digitised newspapers available through Trove.
      Articles were identified using a keyword search for the term
      <em> bushfire</em>. Placenames surrounding the search term were extracted and
      geo located using a custom geocoding algorithm. The dataset covers articles
      published between 1850 and 1900.
    </p>
  </div>
</section>

<section id="map">
  <div className="bg-surface-0 border border-surface-border rounded-lg p-5">
    <h2 className="text-xl font-semibold mb-2">How the map works</h2>

    <p className="text-sm leading-relaxed text-gray-800 mb-3">
      The map uses deck.gl and MapLibre to display and cluster locations
      dynamically. At lower zoom levels clusters indicate broad areas of
      reporting. As you zoom in, clusters separate into individual points. The
      Results panel lists the articles corresponding to the currently visible
      points and filters.
    </p>

    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
      <li>Select clusters to filter the Results panel to those articles.</li>
      <li>Use the timeline to restrict the period displayed on the map.</li>
      <li>Use the search box to locate towns or suburbs mentioned in reports.</li>
    </ul>
  </div>
</section>


        <section id="interpretation">
  <h2 className="text-xl font-semibold mb-2">Interpreting results</h2>
  <p className="text-sm leading-relaxed text-gray-800 mb-4">
    The visualisation reflects patterns in newspaper reporting rather than a complete
    record of all fire events. Reporting varies with population density, editorial
    practices and the availability of correspondents. Location accuracy also depends
    on the clarity and consistency of historical placenames.

    geographic references in this dataset are more closely linked to public responses 
    and cultural acknowledgments of bushfires than to their precise physical locations. 
    This observation does not diminish the value of the research; instead, it clarifies the
     contingent nature of the data produced. The LOCATION entities identified through NER do 
     not necessarily denote the exact sites of historical fires. Rather, they capture placenames 
     that occur in close linguistic proximity to the term bushfire, a proximity that usually signals a 
     meaningful association between place and disaster.
In many cases, these locations represent communities that experienced, observed, or reacted to bushfires, 
whether directly affected or situated nearby. A temporal dimension is also evident. The publication date of
 each article reflects when communities recognised and responded to bushfire events, which does not always
  align with the precise timing of the fires themselves. Together, these factors highlight how the corpus 
  records cultural and environmental responses to bushfire, offering insights that extend beyond the identification 
  of exact geographic coordinates.
  </p>

  <h3 className="text-base font-semibold mt-10 mb-3">
  Identifying bushfires
</h3>
<p className="text-sm leading-relaxed text-gray-800 mb-4">
  A structured process was developed to identify newspaper articles reporting
  bushfires and extract the placenames most relevant for mapping. The following
  steps outline the workflow used to isolate bushfire related content from the
  broader corpus of digitised newspapers.
</p>

<div className="rounded-lg border border-surface-border bg-surface-0 px-4 py-4 sm:px-5 sm:py-5 space-y-4">

  {/* Step 1 */}
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
      1
    </div>
    <div>
      <p className="font-semibold text-sm text-brand-dark">Build the corpus</p>
      <p className="text-sm text-gray-800 mt-1">
        The Trove API is used to collect digitised newspaper articles containing
        spelling variants and near variants of the term <em>bushfire</em>. This
        includes historical orthography and OCR affected forms.
      </p>
    </div>
  </div>

  {/* Step 2 */}
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
      2
    </div>
    <div>
      <p className="font-semibold text-sm text-brand-dark">Apply initial NER</p>
      <p className="text-sm text-gray-800 mt-1">
        The Stanford NER three class model is applied to extract PERSON,
        ORGANISATION and LOCATION entities from the corpus. This provides an
        initial set of candidate placenames associated with reported bushfires.
      </p>
    </div>
  </div>

  {/* Step 3 */}
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
      3
    </div>
    <div>
      <p className="font-semibold text-sm text-brand-dark">Establish a context window</p>
      <p className="text-sm text-gray-800 mt-1">
        A context window is defined around occurrences of the term 
        <em> bushfire</em> to capture placenames appearing in close descriptive
        proximity. A span of approximately 600 characters is used to
        accommodate variation in article structure, genre and nineteenth century
        writing conventions.
      </p>
    </div>
  </div>

  {/* Step 4 */}
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
      4
    </div>
    <div>
      <p className="font-semibold text-sm text-brand-dark">Apply relevance rules</p>
      <p className="text-sm text-gray-800 mt-1">
        LOCATION entities that are too broad to indicate a specific bushfire site,
        such as <em>Australia</em>, are excluded. This step removes generic or
        non informative geographic references that would otherwise affect
        geolocation accuracy.
      </p>
    </div>
  </div>

</div>


  <h3 className="text-base font-semibold mb-3">
    Disambiguation heuristic for historical placenames
  </h3>
  <p className="text-sm leading-relaxed text-gray-800 mb-4">
    A structured heuristic was developed to assign approximate coordinates to
    historical placenames while making uncertainty explicit. The aim is to identify
    the general area associated with a reported fire, not the precise ignition point.
  </p>

  {/* Styled container for steps */}
  <div className="rounded-lg border border-surface-border bg-surface-0 px-4 py-4 sm:px-5 sm:py-5 space-y-4">
    {/* Step 1 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        1
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Retrieve all gazetteer entries
        </p>
        <p className="text-sm text-gray-800 mt-1">
          For each placename extracted through named entity recognition, entries are
          gathered from the Gazetteer of Historical Australian Placenames (GHAP),
          including colony or state, geographic class and coordinates.
        </p>
      </div>
    </div>

    {/* Step 2 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        2
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Identify the most likely colony
        </p>
        <p className="text-sm text-gray-800 mt-1">
          The number of colonies represented in the results is converted into an
          above chance threshold (for example two colonies → 50 per cent; five
          colonies → 20 per cent). If one colony exceeds the threshold it is selected.
          If none exceeds it, the placename is classified as{" "}
          <span className="font-semibold">ambiguous</span> and excluded from
          automated geolocation.
        </p>
      </div>
    </div>

    {/* Step 3 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        3
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Average coordinates within a single colony
        </p>
        <p className="text-sm text-gray-800 mt-1">
          When a single colony can be confidently assigned, the mean latitude and
          longitude of all GHAP entries for that placename in that colony are used to
          produce an approximate coordinate suitable for historical analysis.
        </p>
      </div>
    </div>

    {/* Step 4 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        4
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Detect duplication within a colony
        </p>
        <p className="text-sm text-gray-800 mt-1">
          Distances between each GHAP coordinate and the mean coordinate are
          measured. The median distance indicates whether multiple unrelated locations
          share the same name:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-800 mt-1 space-y-0.5">
          <li>Median distance ≥ 1 degree → classified as ambiguous.</li>
          <li>Median distance &lt; 1 degree → averaged coordinate retained.</li>
        </ul>
      </div>
    </div>

    {/* Step 5 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        5
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Handle OCR and spelling variation
        </p>
        <p className="text-sm text-gray-800 mt-1">
          Historical newspapers contain OCR errors and spelling variants. Fuzzy
          matching (Levenshtein distance) is used to align these forms with GHAP
          entries. Matches above a defined similarity threshold are then processed
          using the same steps as above.
        </p>
      </div>
    </div>

    {/* Step 6 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        6
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Label ambiguous cases
        </p>
        <p className="text-sm text-gray-800 mt-1">
          A placename is formally treated as ambiguous if it cannot be assigned to a
          single colony above chance, or if evidence indicates multiple distinct
          locations within one colony. Ambiguous cases are flagged in the dataset and
          excluded from automated spatial analysis unless manually resolved.
        </p>
      </div>
    </div>

    {/* Step 7 */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-dark text-white text-xs font-semibold flex items-center justify-center">
        7
      </div>
      <div>
        <p className="font-semibold text-sm text-brand-dark">
          Produce a transparent, context aware dataset
        </p>
        <p className="text-sm text-gray-800 mt-1">
          The heuristic avoids opaque selections from black box geocoding services
          and explicitly encodes levels of uncertainty. The resulting coordinates are
          appropriate for analysing patterns in reported bushfires and understanding
          the geography of historical reporting. The final dataset documents more
          than 120,000 historical fire locations while making spatial ambiguity
          visible and manageable.
        </p>
      </div>
    </div>
  </div>
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
                Data from Trove. 
              </p>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
