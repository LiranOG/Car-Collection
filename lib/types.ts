export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  engine: string;
  horsepower: number;
  torque: number; // lb-ft
  zeroToSixty: number; // seconds
  topSpeed: number; // mph
  weight: number; // lbs
  imageUrl: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  carId?: string;
  imageUrl?: string;
}

export interface GarageState {
  savedCarIds: string[];
  addCar: (id: string) => void;
  removeCar: (id: string) => void;
  hasCar: (id: string) => boolean;
}

export interface AIAnalysisResult {
  make: string;
  model: string;
  year: number;
  confidence: number;
  engineType?: string;
  estimatedRPM?: number;
  keySpecs: {
    horsepower?: number;
    zeroToSixty?: number;
    topSpeed?: number;
  };
  searchVerification?: {
    verified: boolean;
    sourceUrl?: string;
    summary?: string;
  };
}
