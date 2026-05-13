import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Studio CRM",
  version: packageJson.version,
  copyright: `© ${currentYear}, Studio CRM.`,
  meta: {
    title: "Studio CRM",
    description:
      "Studio CRM là CRM quản trị dữ liệu hiện đại được xây dựng với Next.js, TypeScript và Tailwind CSS do Nextgency phát triển.",
  },
};
