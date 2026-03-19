import { Loader } from "@/components/ui/loader";

export default function GlobalLoading() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-16">
      <Loader />
    </section>
  );
}
