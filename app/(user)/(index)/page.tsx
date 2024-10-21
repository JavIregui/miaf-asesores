import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="pb-96">

      <section className="bg-[url('/indexBg.jpg')]">
        <div className="bg-gradient-to-b from-[#000000bf] to-transparent py-32">
          <h2 className="font-playfair font-normal text-4xl text-white w-3/12">
            Todas las novedades en materia tributaria
          </h2>

          <Button variant="destructive">Button</Button>
        </div>
      </section>
        
    </div>
  );
}
