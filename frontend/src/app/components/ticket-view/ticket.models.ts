export class Ticket {
  _id: string; // MongoDB-generated ID
  issuer: string; // User ID (referenced from the User model)
  issuerName: string; // User name (referenced from the User model)
  name: string; // Ticket name
  description: string; // Ticket description
  status: string; // Ticket status ('open', 'in progress', or 'closed')
  createdAt: Date; // Creation timestamp

  constructor(
    _id: string,
    issuer: string,
    issuerName: string,
    name: string,
    description: string,
    status: string,
    createdAt: Date
  ) {
    if (!['open', 'closed'].includes(status)) {
      throw new Error("Invalid status value. Allowed values are 'open' or 'closed'.");
    }
    this._id = _id;
    this.issuer = issuer;
    this.issuerName = issuerName;
    this.name = name;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
  }
}