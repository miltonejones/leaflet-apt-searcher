# 3D Teepee

This is a React app that displays an interactive map with location markers and a chatbot.

## Features

- Displays a Leaflet map with tile layers
- Renders markers from GeoJSON data for different cities
- Markers can be clicked to view info popups
- Markers change color based on selected/favorite status
- Polylines connect markers to show public transit lines 
- Circle markers indicate stations along transit lines
- Can switch between viewing data for different cities
- Includes autocomplete search to find locations
- Saves/loads location data from JSON files in S3
- Has image upload for location markers
- Integrates an AI chatbot to answer questions about locations
- Chatbot responses are added to message history

## Usage

The map centers on a selected location marker on click. The marker info popup includes various details about the location, options to favorite it, open its listing URL, and upload an image.

The chatbot can be sent questions about the currently selected location. Its responses are context-aware based on the location data. Chat history is maintained in state.

Locations can be searched via the autocomplete component. JSON data for markers is loaded from S3 buckets for each city.

## Running Locally

The app requires Node.js and npm/yarn installed.

- Clone the repo
- Install dependencies with `npm install` 
- Start dev server with `npm start`
- Open [http://localhost:3000](http://localhost:3000)

Requires API keys for Mapbox and Anthropic to be configured in `.env` file.

## Built With

- [React](https://reactjs.org/) 
- [Material UI](https://mui.com/) - For UI components
- [Leaflet](https://leafletjs.com/) - Mapping library
- [React Leaflet](https://react-leaflet.js.org/) - React wrapper for Leaflet
- [Anthropic](https://www.anthropic.com/) - AI assistant API

## Author

- Milton Jones
 