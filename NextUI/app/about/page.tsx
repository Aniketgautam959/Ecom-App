import CmsPage from "@/components/CmsPage";

async function getPage(slug: string) {
  try {
    const res = await fetch(
      `${process.env.LARAVEL_INTERNAL_URL}/api/pages/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const page = await getPage("about");

  const fallback = {
    title: "About Us",
    content: (
      <div className="space-y-6">
        <p>
          We&apos;re a modern e-commerce platform built to bring you quality products at fair prices,
          backed by a shopping experience that puts you first. From curated collections to reliable
          delivery, everything we do is designed around our customers.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Mission</h3>
        <p>
          To make quality products accessible to everyone through a seamless, transparent, and
          enjoyable online shopping experience.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Vision</h3>
        <p>
          To become the most trusted destination for online shopping, known for our commitment to
          quality, value, and customer happiness.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Why Choose Us</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Fast Delivery</strong> — Reliable shipping across the country with real-time tracking.</li>
          <li><strong>Secure Payments</strong> — Your transactions are protected with industry-grade encryption.</li>
          <li><strong>Easy Returns</strong> — Hassle-free returns and exchanges within 7 days of delivery.</li>
          <li><strong>24/7 Support</strong> — Our team is always here to help you with any questions.</li>
        </ul>
      </div>
    ),
  };

  return <CmsPage page={page} fallback={fallback} />;
}
