export default async function (req: any, res: any) {
  try {
    const { default: app } = await import("../server/_core/index.js");
    return app(req, res);
  } catch (e: any) {
    console.error("Vercel Serverless Error:", e);
    return res.status(500).json({ 
      error: "Vercel Serverless Crash", 
      message: e?.message || String(e),
      stack: e?.stack 
    });
  }
}
