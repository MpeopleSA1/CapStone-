import { CAT_API_KEY } from "./config.js";

const BASE = "https://api.thecatapi.com/v1";

function headers() {
  return {
    "Content-Type": "application/json",
    "x-api-key": CAT_API_KEY
  };
}

// GET breeds (dropdown)
export async function getBreeds() {
  const res = await fetch(`${BASE}/breeds`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to load breeds.");
  return res.json();
}

/**
 * GET images using /images/search with pagination (page/limit/order). [1](https://documenter.getpostman.com/view/4016432/RWToRJCq)
 */
export async function searchImages({ breedId, page, limit, order = "DESC" }, signal) {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    order,
    has_breeds: "1"
  });
  if (breedId) params.set("breed_ids", breedId);

  const res = await fetch(`${BASE}/images/search?${params.toString()}`, {
    headers: headers(),
    signal
  });

  if (!res.ok) throw new Error("Failed to load cat images.");
  const data = await res.json();

  // Pagination headers are returned when order=ASC/DESC with an API key. [1](https://documenter.getpostman.com/view/4016432/RWToRJCq)
  const countHeader = res.headers.get("Pagination-Count") ?? res.headers.get("pagination-count");
  const totalCount = countHeader ? Number(countHeader) : null;

  return { data, totalCount };
}

// POST favourite (save). [2](https://developers.qodex.ai/thatapicompany-public-documentation/the-cat-api/favourites-1/favourites-3)
export async function addFavourite(imageId) {
  const res = await fetch(`${BASE}/favourites`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ image_id: imageId })
  });

  if (!res.ok) throw new Error("Failed to favourite cat.");
  return res.json();
}

// GET favourites
export async function getFavourites() {
  const res = await fetch(`${BASE}/favourites`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to load favourites.");
  return res.json();
}

// DELETE favourite (bonus)
export async function deleteFavourite(favouriteId) {
  const res = await fetch(`${BASE}/favourites/${favouriteId}`, {
    method: "DELETE",
    headers: headers()
  });

  if (!res.ok) throw new Error("Failed to remove favourite.");
  return true;
}