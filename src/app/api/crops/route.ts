import { NextRequest, NextResponse } from "next/server";
import cropsData from "@/data/crops.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cropId = searchParams.get("id");
  const query = searchParams.get("q");

  if (cropId) {
    const crop = cropsData.find((c) => c.id === cropId);
    if (!crop) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }
    return NextResponse.json(crop);
  }

  if (query) {
    const q = query.toLowerCase();
    const results = cropsData.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.hindi_name.includes(q) ||
        c.id.includes(q)
    );
    return NextResponse.json(results);
  }

  return NextResponse.json(cropsData);
}
