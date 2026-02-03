export class Chat {
  constructor({ id, tenantId, createdAt }) {
    this.id = id;
    this.tenantId = tenantId;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      createdAt: this.createdAt
    };
  }
}
