import { Option } from "./option.model";
import { Reference } from "./reference.model";

export class Question {
  // Question Number (e.g. 1.101)
  public id!: string;
  // Question Text
  public q!: string;
  // Options (e.g. a,b,c)
  public o!: Option[];
  // Correct Options
  public c!: string[];
  // Answertext
  public a!: string;
  // True if there are no multi-choice options
  public textonly!: boolean;
  // Reference to a book, a law, or an image
  public reference!: Reference;
  // (e.g. A, B, C, ...)
  public section!: string;
}
