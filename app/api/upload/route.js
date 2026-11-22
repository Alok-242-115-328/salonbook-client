import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("image");

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // ফাইলটিকে FormData তে রূপান্তর করা হচ্ছে ImgBB-তে পাঠানোর জন্য
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const imgbbData = await res.json();

    if (imgbbData.success) {
      return NextResponse.json({ url: imgbbData.data.url });
    } else {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}