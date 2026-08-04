import { Helmet } from "react-helmet-async";

const SITE_URL = "https://chillzone.org.uk";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** Absolute or site-relative path to a social preview image (1200x630 recommended). */
  image?: string;
  imageAlt?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: Record<string, unknown>;
}

const SEO = ({
  title,
  description,
  path,
  type = "website",
  image,
  imageAlt,
  twitterCard,
  jsonLd,
}: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : undefined;
  const card = twitterCard ?? (imageUrl ? "summary_large_image" : "summary");

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ChillZone" />
      <meta name="twitter:card" content={card} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta property="og:image:width" content="1200" />}
      {imageUrl && <meta property="og:image:height" content="630" />}
      {imageUrl && imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageUrl && imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
