export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    gender: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = await params;
  const { page } = await searchParams;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: page ? parseInt(page) : 1,
    gender: gender as Gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };
  return (
    <div>
      <Title
        title={`Artículos ${labels[gender]}`}
        subtitle={"Todos los productos"}
        className="mg-b2"
      />
      <ProductGrid
        products={products.filter((product) => product.gender === gender)}
      />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
