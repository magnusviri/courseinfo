# Courses-frontend

This is a web frontend to display the data from [courses-backend](https://github.com/magnusviri/courses-backend). Written in Angular (Javascript).

To see it in action head to https://courseinfo.biology.utah.edu.

## Installation

Set up a Linux server with apache, ssl, backup, firewall, and git.

### Install node

nvm - get instructions from https://github.com/nvm-sh/nvm

	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
	nvm install node
	npm -v

Show which versions can be installed

	nvm list-remote
	nvm install 10.9.0

## Development

	git clone https://github.com/magnusviri/courses-frontend.git
	cd courses-frontend
	npm install
	ng serve -o

It will open in your web browser. This is configured to use the backend at https://courseinfo.biology.utah.edu/api. To change the backend, open src/app/datastore.service.ts and change the following line to point to whatever you want.

>     baseUrl: 'https://courseinfo.biology.utah.edu/api',

If you aren't aware of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) you will probably bump into this issue. That is, if you try to set this up and the data never loads you should open the web browser console and see if it's complaining about CORS.

## Production

	ng build --prod

Look in dist/courses-frontend. Move it to a web server.

I'm sure you could put this on any web server. I host it inside of a [courses-backend](https://github.com/magnusviri/courses-backend), which is a Laravel app. The courses-backend readme explains how I do that.