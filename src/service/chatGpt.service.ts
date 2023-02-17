import { Provide } from '@midwayjs/core';

@Provide()
export class ChatGptService {
  getAnswer(question: string) {
    return question;
  }
}
