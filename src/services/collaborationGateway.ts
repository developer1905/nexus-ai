import { AgentProtocolMessage, CollaborationTrace } from '../types';

export class CollaborationGateway {
  static generateTraceId(prefix: string = 'tr'): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  }

  static canDelegate(senderId: string, receiverId: string): boolean {
    if (senderId === receiverId) return false;
    return true;
  }

  static createTrace(msg: AgentProtocolMessage): CollaborationTrace {
    return {
      traceId: msg.traceId,
      timestamp: msg.timestamp,
      senderId: msg.senderAgentId,
      senderName: msg.senderAgentName,
      receiverId: msg.receiverAgentId,
      receiverName: msg.receiverAgentName,
      taskId: msg.taskId,
      taskTitle: msg.instructions || 'Avtonom Topshiriq',
      messageType: msg.messageType,
      status: 'success',
      durationMs: msg.durationMs || 45,
      details: msg.content
    };
  }
}
