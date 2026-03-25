import {
  getBreeds,
  searchImages,
  addFavourite,
  getFavourites,
  deleteFavourite
} from "./catApi.js";

import { createSubscription, patchSubscription } from "./newsletterApi.js";

import {
  setStatus,
  renderBreeds,
  renderGallery,
  renderFavourites,
  setLoadingState,
  setPageInfo
} from "./ui.js";

export async function initApp() {
  // DOM
  const breedSelect = document.getElementById("breedSelect");
  const limitSelect = document.getElementById("limitSelect");
  const searchBtn = document.getElementById("searchBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");
  const statusEl = document.getElementById("status");
  const gallery = document.getElementById("gallery");
  const favouritesGallery = document.getElementById("favoritesGallery");

  // Newsletter
  const newsletterForm = document.getElementById("newsletterForm");
  const subscriptionPanel = document.getElementById("subscriptionPanel");
  const updatePreferenceBtn = document.getElementById("updatePreferenceBtn");
  const subStatus = document.getElementById("subStatus");
  const emailInput = document.getElementById("email");
  const frequencySelect = document.getElementById("frequency");
  const subscribeBtn = document.getElementById("subscribeBtn");

  // State
  const state = {
    breedId: "",
    page: 0,
    limit: Number(limitSelect.value),
    totalCount: null,
    subscriptionId: null
  };

  // Event-loop safety: abort old requests + ignore late responses
  let controller = null;
  let requestToken = 0;

  function totalPages() {
    if (!state.totalCount) return null;
    return Math.max(1, Math.ceil(state.totalCount / state.limit));
  }

  function updatePagerButtons() {
    const pages = totalPages();
    prevBtn.disabled = state.page <= 0;
    nextBtn.disabled = pages ? state.page >= pages - 1 : false;
    setPageInfo(pageInfo, state.page, pages);
  }

  async function loadBreedsOnce() {
    try {
      setStatus(statusEl, "Loading breeds...");
      const breeds = await getBreeds();
      renderBreeds(breedSelect, breeds);
      setStatus(statusEl, "Pick a breed and click Search.");
    } catch (err) {
      setStatus(statusEl, err.message);
      breedSelect.innerHTML = `<option value="">Could not load breeds</option>`;
    }
  }

  async function loadGallery() {
    if (controller) controller.abort();
    controller = new AbortController();

    const myToken = ++requestToken;

    try {
      setLoadingState({ buttons: [searchBtn, prevBtn, nextBtn], isLoading: true });
      setStatus(statusEl, "Loading cats...");

      const { data, totalCount } = await searchImages(
        {
          breedId: state.breedId,
          page: state.page,
          limit: state.limit,
          order: "DESC"
        },
        controller.signal
      );

      // Ignore late responses (prevents out-of-order UI updates)
      if (myToken !== requestToken) return;

      state.totalCount = totalCount;

      renderGallery(gallery, data, async (imageId) => {
        try {
          setStatus(statusEl, "Saving favourite...");
          await addFavourite(imageId);
          setStatus(statusEl, "Saved to favourites ❤️");
          await loadFavourites();
        } catch (e) {
          setStatus(statusEl, e.message);
        }
      });

      updatePagerButtons();
      setStatus(statusEl, `Loaded ${data.length} cats.`);
    } catch (err) {
      if (err.name === "AbortError") return;
      setStatus(statusEl, err.message);
    } finally {
      setLoadingState({ buttons: [searchBtn], isLoading: false });
      updatePagerButtons();
    }
  }

  async function loadFavourites() {
    try {
      const favs = await getFavourites();
      renderFavourites(favouritesGallery, favs, async (favId) => {
        try {
          await deleteFavourite(favId);
          await loadFavourites();
        } catch (e) {
          setStatus(statusEl, e.message);
        }
      });
    } catch (err) {
      favouritesGallery.innerHTML = `<p class="small">${err.message}</p>`;
    }
  }

  // Events
  searchBtn.addEventListener("click", async () => {
    state.breedId = breedSelect.value;
    state.limit = Number(limitSelect.value);
    state.page = 0;
    await loadGallery();
  });

  limitSelect.addEventListener("change", async () => {
    state.limit = Number(limitSelect.value);
    state.page = 0;
    await loadGallery();
  });

  prevBtn.addEventListener("click", async () => {
    if (state.page > 0) {
      state.page--;
      await loadGallery();
    }
  });

  nextBtn.addEventListener("click", async () => {
    state.page++;
    await loadGallery();
  });

  // Newsletter POST
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus(subStatus, "");

    try {
      subscribeBtn.disabled = true;

      const email = emailInput.value.trim();
      const frequency = frequencySelect.value;

      const created = await createSubscription({ email, frequency });
      state.subscriptionId = created.id;

      subscriptionPanel.classList.remove("hidden");
      setStatus(subStatus, `Subscribed! Your test subscription id is ${created.id}.`);
    } catch (err) {
      setStatus(subStatus, err.message);
    } finally {
      subscribeBtn.disabled = false;
    }
  });

  // Newsletter PATCH
  updatePreferenceBtn.addEventListener("click", async () => {
    if (!state.subscriptionId) {
      setStatus(subStatus, "No subscription id found. Subscribe first.");
      return;
    }

    try {
      updatePreferenceBtn.disabled = true;

      const newFrequency = frequencySelect.value === "weekly" ? "monthly" : "weekly";
      frequencySelect.value = newFrequency;

      await patchSubscription(state.subscriptionId, { frequency: newFrequency });
      setStatus(subStatus, `Updated preference to ${newFrequency} (PATCH).`);
    } catch (err) {
      setStatus(subStatus, err.message);
    } finally {
      updatePreferenceBtn.disabled = false;
    }
  });

  // Start
  await loadBreedsOnce();
  await loadGallery();
  await loadFavourites();
}