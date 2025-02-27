import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  getDocs,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where, Timestamp
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import {Score} from "../model/Score";

export class Firebase {
  private static instance: Firebase;

  private readonly app: FirebaseApp
  private readonly firestore: Firestore;
  private auth;

  constructor() {
    this.app = initializeApp({
      projectId: "minor-7002",
      apiKey: "AIzaSyBVYDxZIFgiXxycWAQ_2igB7xWbCWNcqdw"
    });
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);

    signInAnonymously(this.auth)
    .then(() => { console.log('Signed in anonymously')})
    .catch((e) => { console.error('Error signing in: ', e)});
  }

  public static getInstance(): Firebase {
    if (!Firebase.instance) {
      Firebase.instance = new Firebase();
    }

    return Firebase.instance;
  }

  async getScores(difficulty: string): Promise<Score[]> {
    const scores: Score[] = [];
    const nbResults = difficulty === 'incredible' ? 15 : 5

    const scoresCollection = collection(this.firestore, "scores");
    const scoresQuery = query(
      scoresCollection,
      where("difficulty", "==", difficulty),
      orderBy("time", "asc"),
      limit(nbResults)
    );
    const snapshot = await getDocs(scoresQuery);

    snapshot.forEach((doc) => {
      const { name, time, seed, difficulty, createdAt } = doc.data();
      scores.push(new Score(name, time, seed, difficulty, createdAt));
    });

    while (scores.length < nbResults) {
      scores.push(new Score('--- --- --- ---', 0.0, '--- --- --- ---', null, new Timestamp(0, 0)));
    }
    return scores;
  }

  async addScore(name: string, time: number, seed: string, difficulty: string) {
    const scoreData = new Score(name, time, seed, difficulty);
    const scoresCollection = collection(this.firestore, 'scores');

    addDoc(scoresCollection, {...scoreData})
      .then(() => { console.log('Score added')})
      .catch((e) => console.error('Error adding score: ', e));
  }
}