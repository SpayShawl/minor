export class Score {
  name: string;
  time: number;
  seed: string;
  difficulty: string;
  createdAt: any;

  constructor(name: string, time: number, seed: string, difficulty: string, createdAt?: any) {
    this.name = name;
    this.time = time;
    this.seed = seed;
    this.difficulty = difficulty;
    this.createdAt = createdAt ?? new Date();
  }
}