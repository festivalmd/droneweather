import droneHero from "@/assets/drone-hero.png";

const AeroHero = () => {
  return (
    <section className="relative px-6 pt-16 pb-10 text-center md:pt-24 md:pb-14 overflow-hidden">
      {/* Large drone image — prominent background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <img
          src={droneHero}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="w-[90%] max-w-[800px] opacity-20 animate-float md:opacity-25"
        />
      </div>

      {/* Glow effect behind drone */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-primary/15 blur-[100px] animate-pulse-glow" />

      <h1 className="relative mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-in-up drop-shadow-lg">
        Узнайте, можно ли летать прямо сейчас
      </h1>
      <p className="relative mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
        Анализ погоды, локальных ограничений и технических возможностей вашего DJI
        в любой точке мира.
      </p>
    </section>
  );
};

export default AeroHero;
