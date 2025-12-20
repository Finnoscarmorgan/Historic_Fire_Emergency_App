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

    <div className="mt-4 space-y-4">
         <p className="text-sm leading-relaxed text-gray-800">
        This web application visualises a subset of a larger bushfire dataset. Both datasets are archived on Zenodo, with the subset used here listed as the first dataset. Detailed information about the second, more comprehensive dataset is provided here.    </p>
      <p className="text-sm leading-relaxed text-gray-800">
        This section provides an overview of the fields contained within the dataset and explains how each variable should be interpreted. The dataset comprises extracted placenames associated with historical bushfire reporting
        Placename coordinates are derived from the Gazetteer of Historical Australian Placenames (GHAP),
        hosted by the Time Layered Cultural Map of Australia:{" "}
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

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Key fields</h3>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li><span className="font-semibold">Index</span>: Index value for each record.</li>
          <li><span className="font-semibold">article_id</span>: Unique identifier for a newspaper article (the same identifier indicates the same article).</li>
          <li><span className="font-semibold">article_placename</span>: Placename extracted from the article in reference to bushfires. Each placename can be treated as a reported bushfire occurrence. Many articles contain multiple placenames.</li>
          <li><span className="font-semibold">filename_2</span>: This field records the Trove generated identifier for each article extract, with an additional element such as “(1 of 1)” or “(1 of 2)”. These naming conventions reflect an internal processing step in which full newspaper articles were segmented into smaller text chunks of approximately 600 characters. The numbering indicates the number of occurrences of the term bush-fire within the article</li>
          <li><span className="font-semibold">Longitude</span> and <span className="font-semibold">Latitude</span>: Point coordinate assigned to the extracted placename.</li>
          <li><span className="font-semibold">State_2</span>: State in which the placename is located (for example VIC, NSW). “No best estimate” indicates insufficient gazetteer evidence to assign a state.</li>
          <li><span className="font-semibold">n_results</span>: Number of gazetteer entries returned for the placename.</li>
          <li><span className="font-semibold">winnerPct</span>: Confidence rating for the selected state assignment, based on the distribution of <span className="font-semibold">n_results</span> across states.</li>
          <li><span className="font-semibold">searchType</span>: Whether the placename match is exact or fuzzy.</li>
          <li><span className="font-semibold">Threshold</span>: Levenshtein similarity threshold used for fuzzy matching between <span className="font-semibold">article_placename</span> and gazetteer placenames.</li>
          <li><span className="font-semibold">Latitude_newspaper</span> and <span className="font-semibold">Longitude_newspaper</span>: Point coordinates for the newspaper’s publication location.</li>
          <li><span className="font-semibold">Place</span>: Publication location of the newspaper.</li>
          <li><span className="font-semibold">Newspaper_title</span>: Title of the newspaper.</li>
          <li><span className="font-semibold">State</span>: State of publication of the newspaper.</li>
          <li><span className="font-semibold">Title</span>: Title of the newspaper article.</li>
          <li><span className="font-semibold">Newspaper_id</span>: Trove identifier for the newspaper.</li>
          <li><span className="font-semibold">Page</span>: Page number of the article.</li>
          <li><span className="font-semibold">Date</span>: Publication date.</li>
          <li><span className="font-semibold">Category</span>: Item category (these records are articles).</li>
          <li><span className="font-semibold">Words</span>: Word count for the newspaper article.</li>
          <li><span className="font-semibold">Illustrated</span>: Whether illustrations are present.</li>
          <li><span className="font-semibold">Corrections</span>: Number of community corrections recorded in Trove.</li>
          <li><span className="font-semibold">Snippet</span>: Short excerpt from the article.</li>
          <li><span className="font-semibold">url</span>: Link to the article record.</li>
          <li><span className="font-semibold">page_url</span>: Direct link to the page of the newspaper issue.</li>
        </ul>
      </div>

      

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Quality control fields</h3>
        <p className="text-sm leading-relaxed text-gray-800">
          The following fields were generated for internal validation of coordinate assignment and are not required for most users:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li><span className="font-semibold">Mean_median_dist</span>: Internal measure used to check coordinate consistency across returned gazetteer entries.</li>
          <li><span className="font-semibold">Median_median_dist</span>: Internal measure used to check median distance across returned gazetteer entries. Values greater than 1 indicate ambiguity due to multiple distinct locations sharing the same name.</li>
        </ul>
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
