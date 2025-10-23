import csv, json

input_file = "/Users/FMOR/OneDrive - The University of Melbourne/2025/Collaborations/Bushfire_Dataset_Cleaning_2025/bushfire_data_test_processed.csv"
output_file = "public/articles.geojson"

features = []

with open(input_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            lon = float(row["Longitude"])
            lat = float(row["Latitude"])
        except (KeyError, ValueError):
            continue  # skip rows with missing coords

        feature = {
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {
                "location": row.get("location", ""),
                "state": row.get("State", ""),
                "date": row.get("date", ""),
                "title": row.get("title", ""),
                "newspaper_title": row.get("newspaper_title", ""),
                "url": row.get("url", ""),
                "snippet": row.get("snippet", "")
            }
        }
        features.append(feature)

geojson = {"type": "FeatureCollection", "features": features}

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(geojson, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(features)} features to {output_file}")
