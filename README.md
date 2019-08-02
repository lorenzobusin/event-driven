event-driven
This project shows how to build an Event-Driven cloud architecture that apply the CQRS pattern and Event Sourcing for user management, showing how it was implemented and how to extend it with new feature or new aggregates. 
There are two side of the application: 
	• Admin side: an administrator can execute CRUD operation for each aggregate( users, roles, authorizations and groups) and rebuild the system from a specific timestamp; 
	• User side: a user can sign in into the application the first time logs in; then the user can see or update its profile information.
The application also integrates the authentication function managed by a third-party provider named Auth0.