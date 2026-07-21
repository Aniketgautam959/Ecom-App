import Link from "next/link";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";

interface CmsPageData {
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
}

interface Props {
  page: CmsPageData | null;
  fallback: {
    title: string;
    content: React.ReactNode;
  };
}

export default function CmsPage({ page, fallback }: Props) {
  const title = page?.title ?? fallback.title;
  const content = page?.content ?? null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />

      <main className="flex-1 pt-16">
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Ecommerce</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300">{title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {content ? (
            <div
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {fallback.content}
            </div>
          )}
        </div>
      </main>

      <EcomFooter />
    </div>
  );
}
