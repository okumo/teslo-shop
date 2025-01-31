import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}
export default async function Page({ params }: Props) {
  const resolvedSearchParams = await params;
  const slug = resolvedSearchParams.slug;

  const [product, { data: categories }] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== "new") {
    redirect("/admin/products/");
  }

  const title = slug === "new" ? "Nuevo producto" : "Editar producto";
  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories || []} />
    </>
  );
}
