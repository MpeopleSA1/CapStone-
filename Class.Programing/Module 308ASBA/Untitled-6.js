// JSONPlaceholder supports PATCH requests. [3](https://jsonplaceholder.typicode.com/)
const BASE = "https://jsonplaceholder.typicode.com/posts";

export async function createSubscription({ email, frequency }) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Newsletter Subscription",
      body: `Email: ${email} | Frequency: ${frequency}`,
      userId: 1
    })
  });

  if (!res.ok) throw new Error("Failed to subscribe (test API).");
  return res.json();
}

export async function patchSubscription(id, { frequency }) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: `Updated Frequency: ${frequency}`
    })
  });

  if (!res.ok) throw new Error("Failed to update preference (PATCH).");
  return res.json();
}
``