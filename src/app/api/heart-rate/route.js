let latestBody = null;

export async function POST(req) {
  const body = await req.json();
  latestBody = body;
  return new Response(JSON.stringify({ status: "received" }), { status: 200 });
}

export async function GET() {
  return new Response(JSON.stringify({ body: latestBody }), { status: 200 });
}
