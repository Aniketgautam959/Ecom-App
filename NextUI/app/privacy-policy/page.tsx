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

export default async function PrivacyPolicyPage() {
  const page = await getPage("privacy-policy");

  const fallback = {
    title: "Privacy Policy",
    content: (
      <div className="space-y-6">
        <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Information We Collect</h3>
        <p>We collect information such as your name, email address, phone number, shipping address, and payment details when you create an account or place an order.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How We Use Your Information</h3>
        <p>Your information is used to process orders, provide customer support, improve our services, and communicate important updates or promotional offers.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Security</h3>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or misuse.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Third-Party Services</h3>
        <p>We may share information with trusted payment gateways and logistics partners solely to fulfill your orders and process payments.</p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Rights</h3>
        <p>You can update or delete your account information by contacting our support team. You may also opt out of marketing communications at any time.</p>
      </div>
    ),
  };

  return <CmsPage page={page} fallback={fallback} />;
}
