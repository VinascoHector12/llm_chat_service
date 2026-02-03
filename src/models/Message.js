export class Message {
  constructor({ id, chatId, tenantId, role, content, createdAt }) {
    this.id = id;
    this.chatId = chatId;
    this.tenantId = tenantId;
    this.role = role;
    this.content = content;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      chatId: this.chatId,
      tenantId: this.tenantId,
      role: this.role,
      content: this.content,
      createdAt: this.createdAt
    };
  }
}
