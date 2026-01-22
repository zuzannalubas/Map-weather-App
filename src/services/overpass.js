const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/*
  Pobiera miasta w aktualnym widoku mapy (bounds)
*/
export async function getCities({ south, west, north, east }) {
  const query = `
    [out:json][timeout:25];
    (
      node["place"="city"](${south},${west},${north},${east});
      node["place"="town"](${south},${west},${north},${east});
    );
    out tags center;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
  });

  const data = await response.json();

  return data.elements.map((el) => ({
    id: el.id,
    name: el.tags.name,
    lat: el.lat,
    lon: el.lon,
    population: el.tags.population,
  }));
}
