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

export default async function TermsConditionsPage() {
  const page = await getPage("terms-conditions");

  const fallback = {
    title: "Terms & Conditions",
    content: (
      <div className="space-y-6">
        <p>Welcome to our ecommerce platform. By accessing or using our website, you agree to the following terms and conditions.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Use of Website</h3>
        <p>You agree to use our website for lawful purposes only. Any misuse, fraudulent activity, or abuse of the platform is strictly prohibited.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Orders & Payments</h3>
        <p>All orders are subject to availability and confirmation. Prices are listed in INR and may include applicable taxes. Payments are processed securely through our payment partners.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping & Delivery</h3>
        <p>We aim to deliver orders within the estimated timeframe. Delivery times may vary depending on location and external factors beyond our control.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Returns & Refunds</h3>
        <p>Products may be returned within the specified return window, subject to our return policy. Refunds are processed after the returned item is received and inspected.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Changes to Terms</h3>
        <p>We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
      </div>
    ),
  };

  return <CmsPage page={page} fallback={fallback} />;
}
