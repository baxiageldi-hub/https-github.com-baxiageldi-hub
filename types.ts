
export enum MoodType {
  ENTHUSIASTIC = 'coşkulu',
  CALM = 'sakin',
  SAD = 'üzgün',
  MYSTERIOUS = 'gizemli',
  ENERGETIC = 'enerjik'
}

export interface PromptResult {
  prompt: string;
  lyrics: string;
}
