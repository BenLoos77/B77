// Vercel-Cron-Endpoint: löst täglich den Magazin-Workflow im Repo
// BenLoos77/sales-intelligence per GitHub-API (workflow_dispatch) aus.
//
// Damit hängt der tägliche Lauf NICHT mehr an GitHubs unzuverlässigem
// eigenem Cron-Scheduler, sondern am verlässlichen Vercel-Cron.
//
// Benötigte Vercel-Environment-Variablen:
//   GH_DISPATCH_TOKEN  – GitHub-Token (Fine-grained PAT) mit Actions:
//                        Read and write auf dem Repo sales-intelligence
//   CRON_SECRET        – (optional, empfohlen) schützt den Endpoint;
//                        Vercel sendet ihn beim Cron automatisch als
//                        "Authorization: Bearer <CRON_SECRET>"

const OWNER = "BenLoos77";
const REPO = "sales-intelligence";
const WORKFLOW = "daily-article.yml";

module.exports = async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  const token = process.env.GH_DISPATCH_TOKEN;
  if (!token) {
    return res.status(500).json({ ok: false, error: "GH_DISPATCH_TOKEN fehlt" });
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "b77-magazin-cron",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main" }),
    });

    if (r.status === 204) {
      return res.status(200).json({ ok: true, triggered: `${REPO}/${WORKFLOW}` });
    }
    const detail = await r.text();
    return res.status(502).json({ ok: false, status: r.status, detail: detail.slice(0, 500) });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
};
