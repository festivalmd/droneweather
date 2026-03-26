import { useState } from "react";
import AeroHeader from "@/components/AeroHeader";
import AeroHero from "@/components/AeroHero";
import AeroForm from "@/components/AeroForm";
import AeroDashboard from "@/components/AeroDashboard";
import AeroFooter from "@/components/AeroFooter";

export interface FlightData {
  result: "SAFE" | "CAUTION" | "UNSAFE";
  risk_score: number;
  explanation: string;
  weather: {
    wind: number;
    gust: number;
    rain: number;
    visibility: number;
    temperature: number;
  };
  drone?: {
    name: string;
    max_wind: number;
  };
  city: string;
}

const Index = () => {
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <AeroHeader />
      <AeroHero />
      <AeroForm 
        setFlightData={setFlightData} 
        setIsLoading={setIsLoading}
        setError={setError}
      />
      <AeroDashboard 
        data={flightData} 
        isLoading={isLoading}
        error={error}
      />
      <AeroFooter />
    </div>
  );
};

export default Index;
