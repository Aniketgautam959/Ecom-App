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

export default async function FaqPage() {
  const page = await getPage("faq");

  const fallback = {
    title: "Frequently Asked Questions",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How do I place an order?</h3>
          <p>Browse products, add items to your cart, and proceed to checkout. You can pay securely via Razorpay.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What payment methods do you accept?</h3>
          <p>We accept UPI, credit/debit cards, net banking, and wallets through our secure payment partner.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How can I track my order?</h3>
          <p>Go to My Orders and click on an order to see its current status and tracking information.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What is your return policy?</h3>
          <p>We offer a 7-day return policy for unused items in original packaging. Contact support to initiate a return.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How do I contact customer support?</h3>
          <p>Visit our Contact page or email us at support@example.com. We usually respond within 24 hours.</p>
        </div>
      </div>
    ),
  };

  return <CmsPage page={page} fallback={fallback} />;
}
