import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/pages/ServiceDetail";
import { services } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find(item => item.slug === slug);
  if (!service) return {};
  return {
    title: service.name.fr,
    description: service.summary.fr,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.name.fr, description: service.summary.fr, images: service.image ? [service.image] : ["/assets/hero.webp"] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!services.some(item => item.slug === slug)) notFound();
  return <ServiceDetail slug={slug} />;
}
