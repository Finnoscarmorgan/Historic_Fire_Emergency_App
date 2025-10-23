# Australian Press Map

A Next.js site that visualises newspaper articles as an interactive map with a time slider and location search. Styled to approximate the Emergency Victoria aesthetic.

## Getting started

1. Ensure Node 18+ is installed.
2. Install dependencies:
   ```bash
   npm i
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Visit http://localhost:3000

## Replace the sample data

Put your dataset as a GeoJSON file at `public/articles.geojson`. The site expects a FeatureCollection of Point features with `properties` fields:

- `location` (string)
- `state` (string)
- `date` (ISO string yyyy-mm-dd)
- `title` (string)
- `paper` (string)
- `url` (string)
- `page_url` (string)
- `category` (string, optional)
- `words` (number, optional)

A quick Python script to convert your CSV to GeoJSON is shown in the chat history. Save the output to `public/articles.geojson`.

## Deployment

The app is static and can be deployed to Vercel, Netlify or any Node host. Gzip compression on the host is recommended for faster GeoJSON delivery.


# Add attribution: <a href="https://www.flaticon.com/free-icons/warning" title="warning icons">Warning icons created by Good Ware - Flaticon</a>
# <a href="https://www.flaticon.com/free-icons/no-fire-allowed" title="no fire allowed icons">No fire allowed icons created by Hilmy Abiyyu A. - Flaticon</a>
# <a href="https://www.flaticon.com/free-icons/flammable" title="flammable icons">Flammable icons created by Minh Do - Flaticon</a>