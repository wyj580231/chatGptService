import { Controller, Post, Inject, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ChatGptService } from '../service/chatGpt.service';
import { DingdingService } from '../service/dingding.service';
import { IDingDingMsg } from '../interface';
import { LoggerService } from '../service/logger.service';

@Controller('/talk')
export class TalkController {
  @Inject()
  ctx: Context;

  @Inject()
  chatGptService: ChatGptService;

  @Inject()
  dingdingService: DingdingService;
  @Inject()
  loggerServie: LoggerService;

  @Post('/receiveDingding')
  async receiveDingding(@Body() msg: IDingDingMsg) {
    const answer = await this.chatGptService.getAnswer(msg.text.content);
    this.loggerServie.writeLog(
      `${msg.senderNick}-${msg.conversationType === '1' ? '单聊' : '群聊'}`,
      `${msg.text.content}: ${answer}`,
      true
    );
    await this.dingdingService.sendMsg(msg, answer);
    return true;
  }
}
