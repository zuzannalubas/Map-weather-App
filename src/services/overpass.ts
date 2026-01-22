const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  population?: number;
}

export async function getCities(bounds: {
  south: number;
  west: number;
  north: number;
  east: number;
}): Promise<City[]> {
  const query = `
[out:json][timeout:25];
(
  node["place"="city"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
  node["place"="town"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
);
out body;
`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) return [];

  const data = await response.json();
  if (!data.elements) return [];

  return data.elements
    .filter((el: any) => el.tags?.name)
    .map((el: any) => ({
      id: el.id,
      name: el.tags.name,
      lat: el.lat,
      lon: el.lon,
      population: el.tags.population
        ? Number(el.tags.population)
        : undefined,
    }));
}
