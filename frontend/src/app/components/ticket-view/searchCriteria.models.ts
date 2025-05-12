export class SearchCriteria {
  name: string = ''; // Ticket name
  issuer: string = ''; // Issuer ID
  description: string = ''; // Ticket description
  status: string = ''; // Ticket status ('open', 'in progress', or 'closed')
  createdTime: string = ''; // Created time (date in string format)
}