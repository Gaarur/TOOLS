export default async function (req: any, res: any) {
  try {
    const { default: app } = await import("../server/_core/index.js");
    return app(req, res);
  } catch (e: any) {
    console.error("Vercel Serverless Error:", e);
    return res.status(500).json({
      error: {
        message: e?.message || String(e),
        code: -32603,
        data: {
          code: "INTERNAL_SERVER_ERROR",
          httpStatus: 500,
          stack: e?.stack
        }
      }
    });
  }
}
