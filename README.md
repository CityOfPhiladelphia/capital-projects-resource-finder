# capital-projects-finder

This is the sourcecode for the [Capital projects finder](http://phila-resource-finder-v2.s3-website-us-east-1.amazonaws.com/dev/capital-projects-finder/) app.

The app uses the framework [Pinboard](https://github.com/CityOfPhiladelphia/pinboard), in npm as [@phila/pinboard](https://www.npmjs.com/package/@phila/pinboard).

![Example](https://mapboard-images.s3.amazonaws.com/pinboard/immigrant-resource-finder.JPG)
![Example](https://mapboard-images.s3.amazonaws.com/pinboard/phone-immigrant-resource-finder.JPG)

Full instructions for how this repo uses the @phila/pinboard package can be found in the [Pinboard wiki](https://github.com/CityOfPhiladelphia/pinboard/wiki).

Basic instructions for Getting started are here:

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployments

Commits to the master branch will automatically deploy through travis.ci to an AWS S3 bucket.
