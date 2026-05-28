import { NextRequest, NextResponse } from "next/server";
import productsData from "@/data/products.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const crop = searchParams.get("crop");

  let results = [...productsData];

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (crop) {
    results = results.filter((p) => p.crop_tags.includes(crop.toLowerCase()));
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.problem_tags.some((tag) => tag.includes(q)) ||
        p.crop_tags.some((tag) => tag.includes(q)) ||
        p.category.includes(q)
    );
  }

  // Sort by rating (best first), limit to top 6
  results.sort((a, b) => b.rating - a.rating);
  results = results.slice(0, 6);

  return NextResponse.json(results);
}
