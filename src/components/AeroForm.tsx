import { useState } from "react";
import { MapPin, Plane, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FlightData } from "@/pages/Index";

interface AeroFormProps {
  setFlightData: (data: FlightData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const drones = [
  { value: "DJI Mini 3", label: "DJI Mini 3" },
  { value: "DJI Mini 3 Pro", label: "DJI Mini 3 Pro" },
  { value: "DJI Mini 4 Pro", label: "DJI Mini 4 Pro" },
  { value: "DJI Air 2S", label: "DJI Air 2S" },
  { value: "DJI Air 3", label: "DJI Air 3" },
  { value: "DJI Mavic 3", label: "DJI Mavic 3" },
  { value: "DJI Avata 2", label: "DJI Avata 2" },
];

const popularCities = [
  "Кишинёв, Молдова",
  "Москва, Россия",
  "Санкт-Петербург, Россия",
  "Киев, Украина",
  "Одесса, Украина",
  "Бухарест, Румыния",
  "Варшава, Польша",
  "Берлин, Германия",
  "Прага, Чехия",
  "Вена, Австрия",
  "Лондон, Великобритания",
  "Париж, Франция",
  "Рим, Италия",
  "Мадрид, Испания",
  "Стамбул, Турция",
  "Дубай, ОАЭ",
  "Нью-Йорк, США",
  "Лос-Анджелес, США",
  "Токио, Япония",
  "Сеул, Южная Корея",
  "Пекин, Китай",
  "Шанхай, Китай",
  "Сидней, Австралия",
  "Торонто, Канада",
  "Тель-Авив, Израиль",
];

const AeroForm = ({ setFlightData, setIsLoading, setError }: AeroFormProps) => {
  const [city, setCity] = useState("");
  const [drone, setDrone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = city.length > 0
    ? popularCities.filter(c => 
        c.toLowerCase().includes(city.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSubmit = async () => {
    if (!city.trim()) {
      setError("Введите название города");
      return;
    }
    if (!drone) {
      setError("Выберите модель дрона");
      return;
    }

    setError(null);
    setIsLoading(true);
    setIsSubmitting(true);
    setFlightData(null);

    try {
      const response = await fetch("http://localhost:3001/api/check-flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: city.trim(), drone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при проверке условий");
      }

      const data = await response.json();
      setFlightData({
        ...data,
        city: city.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 pb-12 md:px-12 animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-3 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 md:flex-row md:items-center md:gap-3 md:p-3 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            placeholder="Страна, Город (например: Кишинев)..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="border-0 bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
          />
          {showSuggestions && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              {filteredCities.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCity(c);
                    setShowSuggestions(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <Select value={drone} onValueChange={setDrone}>
          <SelectTrigger className="w-full border-0 bg-secondary text-foreground md:w-56 focus:ring-1 focus:ring-primary">
            <SelectValue placeholder="Выберите модель DJI" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {drones.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plane className="h-4 w-4" />
          )}
          {isSubmitting ? "Проверяем..." : "Полетели"}
        </Button>
      </div>
    </section>
  );
};

export default AeroForm;