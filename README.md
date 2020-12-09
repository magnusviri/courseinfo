# Courses-frontend

This is a web frontend to display the data from [courses-backend](https://github.com/magnusviri/courses-backend). Written in Angular (Javascript).

To see it in action head to https://courseinfo.biology.utah.edu.

## Development

To develop or build for production, you must install node first. If you have node, then proceed to install the app.

### Install node

I use [nvm](https://github.com/nvm-sh/nvm/) so that I can easily and quickly switch versions of node. I needed to do this because the courses-frontend depends on [angular2-jsonapi, which doesn't work with npm 7 right now](https://github.com/ghidoz/angular2-jsonapi/issues/278).

	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
	nvm install node
	npm -v

Show which versions can be installed.

	nvm list-remote
	nvm install v14.15.1

Show the current version.

	nvm which current

### Install the app

Note, right now (December 2020) the [angular2-jsonapi library doesn't work with npm 7](https://github.com/ghidoz/angular2-jsonapi/issues/278). This is why I am installing node v14.15.1 above (which is npm 6). It's also why I'm using nvm to install node, because it makes it easy to switch versions of node.

	git clone https://github.com/magnusviri/courses-frontend.git
	cd courses-frontend
	npm install
	ng serve -o

Your web browser will open to the app. The app is configured to use the backend at https://courseinfo.biology.utah.edu/api. To change the backend, open src/app/datastore.service.ts and change the following line to point to whatever you want.

>     baseUrl: 'https://courseinfo.biology.utah.edu/api',

If you aren't aware of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) you will probably bump into this issue. That is, if you try to set this up and the data never loads you should open the web browser console and see if it's complaining about CORS.

## Production

Angular production apps are simple webpages that have no other dependencies. They will run on any web server.

Run this command on your development server to build the production files.

	ng build --prod

Move the files in dist/courses-frontend to a web server.

I host it inside of courses-backend, which is a Laravel app. The [courses-backend readme](https://github.com/magnusviri/courses-backend#user-content-installing-the-frontend) explains exactly where to put the files.