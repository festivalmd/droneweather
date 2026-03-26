import { Plane, HelpCircle, MapPin, Radar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AeroHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <div className="flex items-center gap-2.5">
        <Plane className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight text-foreground">
          AeroCheck
        </span>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-1.5 text-sm">
            <HelpCircle className="h-4 w-4" />
            Как это работает
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Как это работает
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {[
              { step: "1", icon: <MapPin className="h-5 w-5 text-primary" />, title: "Введите локацию", desc: "Укажите город или страну, где планируете полёт" },
              { step: "2", icon: <Plane className="h-5 w-5 text-primary" />, title: "Выберите дрон", desc: "Выберите вашу модель DJI из списка" },
              { step: "3", icon: <Radar className="h-5 w-5 text-primary" />, title: "Получите сводку", desc: "Мгновенный анализ погоды, законов и возможностей дрона" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    {item.icon}
                    {item.title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default AeroHeader;
