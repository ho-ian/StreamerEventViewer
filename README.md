# Streamer Event Viewer
I created a web application that requires authentication to Twitch before setting their favourite streamer which initiates a backend event listener
for all of the streamer's events. It then redirects the authorized user to a page containing an embedded viewer of the Twitch streamer.

## Getting Started
To get started using my app locally, pull the app and run npm install to obtain the necessary node modules.

### Prerequisites
The required libraries are listed in the package-lock.json.

### Running the App
Run using `node app.js` in a CLI.

### How would you deploy the above on AWS?
In order to deploy this application onto AWS, I would first dockerize the image using Docker. Then once that docker image is running successfully. I upload
that image onto AWS ECR before creating an ECS cluster that will create an EC2 instance from which I create a task with the Docker Image and run the task
off of the cluster. Then the application should be available publicly. 

### Where do you see bottlenecks in your proposed architecture and how would you approach scaling this app starting from 100 reqs/day to 900MM reqs/day over 6 months?
Bottlenecks will exist at the login and embedded pages. After a lot of requests, I believe this architecture will slow down significantly.
In order to scale this application to handle more and more requests, I would say we need to have a database in place to store user logins to 
reduce the number of API calls and to keep track of people's favourite streamers better. 

### Examples
![Landing Page]()
![Set Favourite Streamer]()
![Embedded Page]()
![Backend Listener]()
