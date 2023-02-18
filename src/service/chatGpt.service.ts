import { Provide, Config } from '@midwayjs/core';
import { Configuration, OpenAIApi } from 'openai';

@Provide()
export class ChatGptService {
  @Config('chatGpt')
  config;
  async getAnswer(question: string) {
    const openai = this.getOpenai();
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 2048,
      temperature: 0.5,
      top_p: 0.1,
      best_of: 2,
    });
    return response.data.choices[0].text;
  }
  getOpenai() {
    const configuration = new Configuration({
      apiKey: this.config.API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
  }
}
