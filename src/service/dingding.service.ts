import { Provide, Config, Logger } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
import dingtalkrobot_1_0, * as $dingtalkrobot_1_0 from '@alicloud/dingtalk/dist/robot_1_0/client';
import dingtalkoauth2_1_0, * as $dingtalkoauth2_1_0 from '@alicloud/dingtalk/dist/oauth2_1_0/client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $OpenApi from '@alicloud/openapi-client';
import { IDingDingMsg } from '../interface';

@Provide()
export class DingdingService {
  @Logger()
  logger: ILogger;

  @Config('dingding')
  config;
  static accessToken: string;
  static accessTokenTimestamp: number;
  async sendMsg(msg: IDingDingMsg, content: string) {
    if (msg.conversationType === '1') {
      await this.sendMsgBySingle(msg, content);
    } else {
      await this.sendMsgByGroup(msg, content);
    }
  }
  async sendMsgBySingle(ddMsg: IDingDingMsg, content: string) {
    const token = await this.getAccessToken();
    const client = this.createRobotClient();
    const batchSendOTOHeaders = new $dingtalkrobot_1_0.BatchSendOTOHeaders({
      xAcsDingtalkAccessToken: token,
    });
    const batchSendOTORequest = new $dingtalkrobot_1_0.BatchSendOTORequest({
      openConversationId: ddMsg.conversationId,
      robotCode: ddMsg.robotCode,
      msgKey: 'sampleText', // sampleImageMsg { photoURL: 'xxxx' }
      msgParam: JSON.stringify({
        content,
      }),
      userIds: [ddMsg.senderStaffId],
    });
    if (ddMsg.text.content.startsWith('/i')) {
      batchSendOTORequest.msgKey = 'sampleImageMsg';
      batchSendOTORequest.msgParam = JSON.stringify({
        photoURL: content,
      });
    }
    try {
      await client.orgGroupSendWithOptions(
        batchSendOTORequest,
        batchSendOTOHeaders,
        new $Util.RuntimeOptions({})
      );
    } catch (err) {
      if (!Util.empty(err.code) && !Util.empty(err.message)) {
        // err 中含有 code 和 message 属性，可帮助开发定位问题
      }
    }
  }
  async sendMsgByGroup(ddMsg: IDingDingMsg, content: string) {
    const token = await this.getAccessToken();
    const client = this.createRobotClient();
    const orgGroupSendHeaders = new $dingtalkrobot_1_0.OrgGroupSendHeaders({
      xAcsDingtalkAccessToken: token,
    });
    const orgGroupSendRequest = new $dingtalkrobot_1_0.OrgGroupSendRequest({
      openConversationId: ddMsg.conversationId,
      robotCode: ddMsg.robotCode,
      msgKey: 'sampleText', // sampleImageMsg { photoURL: 'xxxx' }
      msgParam: JSON.stringify({
        content,
      }),
    });
    if (ddMsg.text.content.startsWith('/i')) {
      orgGroupSendRequest.msgKey = 'sampleImageMsg';
      orgGroupSendRequest.msgParam = JSON.stringify({
        photoURL: content,
      });
    }
    try {
      await client.orgGroupSendWithOptions(
        orgGroupSendRequest,
        orgGroupSendHeaders,
        new $Util.RuntimeOptions({})
      );
    } catch (err) {
      if (!Util.empty(err.code) && !Util.empty(err.message)) {
        this.logger.error(err);
        // err 中含有 code 和 message 属性，可帮助开发定位问题
      }
    }
  }
  /**
   * 使用 Token 初始化账号Client
   * @return Client
   * @throws Exception
   */
  createRobotClient(): dingtalkrobot_1_0 {
    const config = new $OpenApi.Config({});
    config.protocol = 'https';
    config.regionId = 'central';
    return new dingtalkrobot_1_0(config);
  }
  async getAccessToken() {
    // token过期时间
    const MAX_AGE = 3600 * 1000;
    if (
      !DingdingService.accessToken ||
      new Date().getTime() - DingdingService.accessTokenTimestamp > MAX_AGE
    ) {
      const config = new $OpenApi.Config({});
      config.protocol = 'https';
      config.regionId = 'central';
      const client = new dingtalkoauth2_1_0(config);
      const getAccessTokenRequest =
        new $dingtalkoauth2_1_0.GetAccessTokenRequest({
          appKey: this.config.AppKey,
          appSecret: this.config.AppSecret,
        });
      try {
        const res = await client.getAccessToken(getAccessTokenRequest);
        DingdingService.accessToken = res.body.accessToken;
        DingdingService.accessTokenTimestamp = new Date().getTime();
      } catch (err) {
        if (!Util.empty(err.code) && !Util.empty(err.message)) {
          this.logger.error(err);
          // err 中含有 code 和 message 属性，可帮助开发定位问题
        }
      }
    }
    return DingdingService.accessToken;
  }
}
