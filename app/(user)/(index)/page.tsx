import Head from 'next/head';
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preload" href="/index.webp" as="image"/>
      </Head>

      <div className="pb-96">
        <section className="bg-[url('/indexBg.webp')] bg-center bg-cover">
          <div className="bg-gradient-to-b from-[#000000bf] to-transparent flex flex-col space-y-12 py-32 px-12 md:px-10 lg:px-16 xl:px-24 2xl:px-28">

            <h2 className="font-playfair font-normal text-4xl text-white w-full md:w-3/5 lg:w-1/2 xl:w-4/12">
              Todas las novedades en materia tributaria
            </h2>

            <Button variant="miafSecondary">Ponte al día!</Button>
          </div>
        </section>

        <section className="bg-miaf-gray-100 flex flex-col space-y-6 py-12 px-12 md:px-10 lg:px-16 xl:px-24 2xl:px-28">
          <div className="flex flex-col space-y-2 w-full md:w-4/5 lg:w-3/5 xl:w-1/2">

            <h3 className="text-miaf-blue-200 text-xl font-playfair font-bold">
              ¿Necesitas asesoramiento personalizado?
            </h3>

            <p className="text-miaf-gray-200 text-base font-roboto font-normal">
              Si necesitas ayuda para tu caso, no dudes en escribirnos. 
              Nuestro equipo está aquí para ofrecerte soluciones adaptadas
              a tus necesidades y ayudarte a tomar las mejores decisiones fiscales.
            </p>
          </div>

          <Button variant="miaf">Contacta con nosotros</Button>
        </section>
    </div>
    </>
  );
}
