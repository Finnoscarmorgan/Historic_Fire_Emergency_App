export default function DataPage() {
  return (
    <div className="bg-surface-50 text-brand-dark min-h-screen">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold mb-6">Data</h1>

        <div className="bg-surface-0 border border-surface-border p-5 space-y-6">

          

          <section>
            <div className="bg-brand-dark text-white mb-4">
  <h2 className="text-xl font-semibold px-4 py-3">
    Dataset
  </h2>
</div>

            <p className="text-sm leading-relaxed text-gray-800">
              The full processed dataset used in this visualisation is publicly
              archived on Zenodo. It includes article level metadata, publication
              dates, extracted placenames, and approximate geolocations used to
              generate the map and timeline views.
            </p>

            <div className="mt-4">
              <a
                href="https://zenodo.org/records/6622328"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-brand-red text-white border border-brand-red hover:opacity-95 pointer-events-auto"
              >
                View dataset on Zenodo
              </a>
            </div>

            <p className="mt-2 text-xs text-gray-600">
              DOI: 10.5281/zenodo.6622328
            </p>
            
          </section>

          <div className="mt-6 pl-6 border-l border-surface-border space-y-6">
            <section>
  <h3 className="text-xl font-semibold mb-3">Understanding the dataset</h3>

  <details className="rounded-md border border-surface-border bg-surface-0 p-4">
  <summary className="cursor-pointer text-sm font-semibold text-brand-dark">
    View dataset explainer
  </summary>

  <div className="mt-4 space-y-6">
    <p className="text-sm leading-relaxed text-gray-800">
      This web application visualises a subset of a larger bushfire dataset.
      Both datasets are archived on Zenodo, with the subset used here listed as
      the first dataset. Detailed information about the second, more
      comprehensive dataset is provided there.
    </p>

    <p className="text-sm leading-relaxed text-gray-800">
      This section outlines the fields contained within the dataset and explains
      how each variable should be interpreted. Placename coordinates are derived
      from the Gazetteer of Historical Australian Placenames (GHAP), hosted by
      the Time Layered Cultural Map of Australia:{" "}
      <a
        href="https://www.tlcmap.org/ghap/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue hover:underline pointer-events-auto"
      >
        https://www.tlcmap.org/ghap/
      </a>
      .
    </p>

    {/* Key fields table */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Key fields</h3>

      <div className="overflow-x-auto">
        <table className="w-full border border-surface-border text-sm">
          <thead className="bg-surface-50">
            <tr>
              <th className="text-left font-semibold px-3 py-2 border-b border-surface-border w-1/3">
                Field
              </th>
              <th className="text-left font-semibold px-3 py-2 border-b border-surface-border">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">Index</td>
              <td className="px-3 py-2">Index value for each record.</td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">article_id</td>
              <td className="px-3 py-2">
                Unique identifier for a newspaper article. The same identifier
                indicates the same article.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">article_placename</td>
              <td className="px-3 py-2">
                Placename extracted from the article in reference to bushfires.
                Each placename can be treated as a reported bushfire occurrence.
                Articles may contain multiple placenames.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">filename_2</td>
              <td className="px-3 py-2">
                Trove-generated identifier for each article extract, including
                segmentation markers such as “(1 of 2)”. These reflect internal
                text chunking during processing.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">Longitude, Latitude</td>
              <td className="px-3 py-2">
                Approximate point coordinates assigned to the extracted
                placename.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">State_2</td>
              <td className="px-3 py-2">
                State in which the placename is located (for example VIC, NSW).
                “No best estimate” indicates insufficient gazetteer evidence.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">n_results</td>
              <td className="px-3 py-2">
                Number of gazetteer entries returned for the placename.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">winnerPct</td>
              <td className="px-3 py-2">
                Confidence rating for the selected state assignment, based on the
                distribution of results across states.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">searchType</td>
              <td className="px-3 py-2">
                Indicates whether placename matching was exact or fuzzy.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">Threshold</td>
              <td className="px-3 py-2">
                Levenshtein similarity threshold used for fuzzy matching.
              </td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="px-3 py-2 font-semibold">Date</td>
              <td className="px-3 py-2">Publication date of the article.</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-semibold">url, page_url</td>
              <td className="px-3 py-2">
                Links to the article record and the specific newspaper page.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Quality control fields */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Quality control fields</h3>
      <p className="text-sm leading-relaxed text-gray-800 mb-2">
        These fields were generated for internal validation and are not required
        for most users.
      </p>

      <table className="w-full border border-surface-border text-sm">
        <tbody>
          <tr className="border-b border-surface-border">
            <td className="px-3 py-2 font-semibold w-1/3">Mean_median_dist</td>
            <td className="px-3 py-2">
              Internal measure used to check coordinate consistency across
              returned gazetteer entries.
            </td>
          </tr>
          <tr>
            <td className="px-3 py-2 font-semibold">Median_median_dist</td>
            <td className="px-3 py-2">
              Median distance across returned gazetteer entries. Values greater
              than 1 indicate ambiguity due to multiple distinct locations
              sharing the same name.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</details>

</section>

          

  <section>
    <h3 className="text-lg font-semibold mb-2">Citation</h3>
    <p className="text-sm leading-relaxed text-gray-800">
      If you use this dataset in research, publications, or derivative works,
      please cite it as follows:
    </p>
    <p className="mt-2 text-sm text-gray-800">
      Fiannuala Morgan. (2022). <em>Finnoscarmorgan/Historical_Fires_Near_Me</em>
      (v1.0.0) [Data set]. Zenodo.{" "}
      <a
        href="https://doi.org/10.5281/zenodo.6622328"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue hover:underline pointer-events-auto"
      >
        https://doi.org/10.5281/zenodo.6622328
      </a>
    </p>
  </section>

  <section>
    <h3 className="text-lg font-semibold mb-2">Use and limitations</h3>
    <p className="text-sm leading-relaxed text-gray-800">
      The dataset is provided for research and exploratory purposes. It reflects
      historical newspaper reporting practices rather than a complete or
      authoritative record of all bushfire events. Geographic locations are
      approximate and publication dates do not always correspond to the precise
      timing of fire activity.
    </p>
  </section>

  <section>
    <h3 className="text-lg font-semibold mb-2">Rights and licence</h3>
    <p className="text-sm leading-relaxed text-gray-800">
      This dataset is licensed under the Creative Commons Attribution 4.0
      International licence (CC BY 4.0). You are free to share and adapt the
      material for any purpose, including commercial use, provided appropriate
      credit is given.
    </p>
  </section>

</div>


          

         <section>
  <div className="bg-brand-dark text-white mb-4">
  <h2 className="text-xl font-semibold px-4 py-3">
    Code
  </h2>
</div>


  <p className="text-sm leading-relaxed text-gray-800">
    All software developed for the collection, processing, analysis, and
    visualisation of the data is openly available. The codebase includes scripts
    for harvesting newspaper articles, extracting placenames using Named Entity
    Recognition, applying the disambiguation heuristic, and generating the
    spatial and temporal representations used in this site.
  </p>

  

  <div className="mt-4">
  <a
    href="https://github.com/Finnoscarmorgan/Historical_Fires_Near_Me"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-brand-red text-white border border-brand-red hover:opacity-95 pointer-events-auto"
  >
    View software on GitHub
  </a>
</div>


<div className="mt-6 pl-6 border-l border-surface-border">
  <h3 className="text-lg font-semibold mb-2">Software citation</h3>
  <p className="text-sm text-gray-800">
    Morgan, F. (2021). <em>Historical_Fires_Near_Me</em> (Version 1.0.0) [Computer
    software].{" "}
    <a
      href="https://doi.org/10.5281/zenodo.6622328"
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-blue hover:underline pointer-events-auto"
    >
      https://doi.org/10.5281/zenodo.6622328
    </a>
  </p>
</div>

</section>



        </div>
      </main>
    </div>
  );
}
