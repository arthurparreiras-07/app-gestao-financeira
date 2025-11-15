import { Emotion } from '../entities/Emotion';

export interface IEmotionRepository {
create(emotion: Emotion): Promise<number>;
findAll(): Promise<Emotion[]>;
findById(id: number): Promise<Emotion | null>;
}