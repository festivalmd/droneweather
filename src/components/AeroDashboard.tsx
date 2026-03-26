import { Wind, Thermometer, Eye, Plane, AlertTriangle, Shield, CheckCircle2, Loader2, MapPin, CloudRain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FlightData } from "@/pages/Index";

interface AeroDashboardProps {
  data: FlightData | null;
  isLoading: boolean;
  error: string | null;
}

const AeroDashboard = ({ data, isLoading, error }: AeroDashboardProps) => {
  // Показываем ошибку
  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-6 pb-16 md:px-12">
        <Card className="border-destructive/30 bg-destructive/5 animate-fade-in-up">
          <CardContent className="flex items-center gap-4 py-5">
            <AlertTriangle className="h-7 w-7 shrink-0 text-destructive" />
            <div>
              <p className="text-lg font-semibold text-destructive">
                ❌ Ошибка
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Показываем лоадер
  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-6 pb-16 md:px-12">
        <Card className="border-border bg-card animate-fade-in-up">
          <CardContent className="flex items-center justify-center gap-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Проверяем условия для полёта...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Если нет данных — не показываем ничего
  if (!data) {
    return null;
  }

  const resultConfig = {
    SAFE: {
      icon: <CheckCircle2 className="h-7 w-7 shrink-0 text-success" />,
      color: "border-success/30 bg-success/5",
      textColor: "text-success",
      emoji: "🟢",
      title: "Полёт безопасен",
    },
    CAUTION: {
      icon: <AlertTriangle className="h-7 w-7 shrink-0 text-warning" />,
      color: "border-warning/30 bg-warning/5",
      textColor: "text-warning",
      emoji: "🟡",
      title: "Полёт возможен с ограничениями",
    },
    UNSAFE: {
      icon: <AlertTriangle className="h-7 w-7 shrink-0 text-destructive" />,
      color: "border-destructive/30 bg-destructive/5",
      textColor: "text-destructive",
      emoji: "🔴",
      title: "Полёт небезопасен",
    },
  };

  const config = resultConfig[data.result];

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 md:px-12">
      {/* Status Card */}
      <Card className={`mb-6 ${config.color} animate-fade-in-up`}>
        <CardContent className="py-5">
          <div className="flex items-center gap-4">
            {config.icon}
            <div className="flex-1">
              <p className={`text-lg font-semibold ${config.textColor}`}>
                {config.emoji} {config.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.explanation}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <p className={`text-2xl font-bold ${config.textColor}`}>
                {Math.round(data.risk_score * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-column grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <WeatherCard weather={data.weather} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
          <DroneCard drone={data.drone} weather={data.weather} result={data.result} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.35s", opacity: 0 }}>
          <LocationCard city={data.city} />
        </div>
      </div>
    </section>
  );
};

const WeatherCard = ({ weather }: { weather: FlightData["weather"] }) => (
  <Card className="border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Wind className="h-5 w-5 text-primary" />
        Погода сейчас
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind className="h-4 w-4" />
          Ветер
        </div>
        <Badge variant={weather.wind > 10 ? "destructive" : "secondary"} className="font-mono text-xs">
          {weather.wind} м/с
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind className="h-4 w-4" />
          Порывы
        </div>
        <span className="text-sm font-medium text-foreground">{weather.gust} м/с</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Thermometer className="h-4 w-4" />
          Температура
        </div>
        <span className="text-sm font-medium text-foreground">{weather.temperature}°C</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          Видимость
        </div>
        <span className="text-sm font-medium text-foreground">{(weather.visibility / 1000).toFixed(1)} км</span>
      </div>
      {weather.rain > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CloudRain className="h-4 w-4" />
            Осадки
          </div>
          <Badge variant="destructive" className="font-mono text-xs">
            {weather.rain} мм
          </Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

const DroneCard = ({ 
  drone, 
  weather, 
  result 
}: { 
  drone: FlightData["drone"]; 
  weather: FlightData["weather"];
  result: FlightData["result"];
}) => {
  const windOk = weather.wind <= drone.max_wind;
  const gustOk = weather.gust <= drone.max_wind;

  return (
    <Card className="border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Plane className="h-5 w-5 text-primary" />
          {drone.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Макс. ветер</span>
          <span className="text-sm font-medium text-foreground">{drone.max_wind} м/с</span>
        </div>
        
        {!windOk && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <p className="flex items-start gap-2 text-xs font-medium text-destructive">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Ветер ({weather.wind} м/с) превышает лимит дрона!
            </p>
          </div>
        )}
        
        {windOk && !gustOk && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
            <p className="flex items-start gap-2 text-xs font-medium text-warning">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Порывы ({weather.gust} м/с) выше лимита!
            </p>
          </div>
        )}
        
        {windOk && gustOk && result === "SAFE" && (
          <div className="rounded-lg border border-success/30 bg-success/5 p-3">
            <p className="flex items-start gap-2 text-xs font-medium text-success">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Условия подходят для полёта
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LocationCard = ({ city }: { city: string }) => (
  <Card className="border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
        <MapPin className="h-5 w-5 text-primary" />
        Локация
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Город</span>
        <span className="text-sm font-medium text-foreground">{city}</span>
      </div>
      <div className="space-y-2 pt-2">
        <p className="text-xs text-muted-foreground font-medium">Общие правила:</p>
        {[
          "Максимальная высота 120м",
          "Не летать над людьми",
          "Следить за погодой",
        ].map((rule) => (
          <div key={rule} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span className="text-sm text-muted-foreground">{rule}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default AeroDashboard;