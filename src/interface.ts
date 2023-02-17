export interface IDingDingMsg {
  /** 目前只支持text */
  msgtype: string;
  /** 消息文本 */
  content: string;
  /** 1：单聊 2：群聊 */
  conversationType: '1' | '2';
  /** 发送者昵称 */
  senderNick: string;
  /** 群名 */
  conversationTitle: string;
  /** 作为发送者userid */
  senderStaffId: string;
  /** 会话ID */
  conversationId: string;
  /** 机器人的编码 */
  robotCode: string;
  text: {
    /** 消息文本 */
    content: string;
  };
}
