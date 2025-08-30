import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t("home.title")}</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 text-center mb-8">{t("home.subtitle")}</p>
          {/* ここにURL管理機能を追加予定 */}
        </div>
      </div>
    </div>
  );
}
