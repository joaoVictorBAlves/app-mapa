# App Map - Census Data Visualization

The App Map is a project developed using `Next.js`, `Leaflet`, `Pixi.js`, and `D3.js`, which provides a map visualization system allowing detailed analysis through markers and polygons. This application is particularly useful for census data analysis, enabling a comprehensive understanding of results in categorical and numerical data.

![image](https://github.com/joaoVictorBAlves/app-mapa/assets/86852231/0501cdf1-a8af-4af6-ac18-d00e0c52fddc)

## Main Features

The App Map has the following key features:

1. **Marker Visualization:**
   - Enables the visualization of each individual response from a census survey.
   - Markers are placed on the map, representing geolocated data.
   - Clicking on a marker provides detailed information about the related response.

2. **Polygon Visualization:**
   - Offers a visualization of data grouped by census sector on the map.
   - Utilizes a choropleth map, where polygon coloration is based on specific values, allowing intuitive and comparative data visualization.
   - Clicking on a polygon displays summarized information about the related census sector.

3. **Categorical and Numerical Data:**
   - The system supports data analysis in both categorical and numerical formats.
   - For categorical data, it allows grouping, counting, and filtering responses based on specific categories.
   - For numerical data, it enables statistical calculations such as mean, median, and standard deviation.

## Prerequisites

Before running the App Map, make sure you have the following prerequisites installed in your development environment:

- Node.js (version X or higher)
- npm (Node.js package manager)

## Installation and Execution

To install and run the App Map, follow the steps below:

1. Clone the project repository to your computer:

```
git clone https://github.com/your-username/app-mapa.git
cd app-mapa
```

2. Install project dependencies using npm:

```
npm install
```

3. Start the development server:

```
npm run dev
```

Now, the App Map will be available at `http://localhost:3000` in your browser.

## Contribution

If you wish to contribute to the development of the App Map, feel free to fork the repository, implement your improvements, and submit a pull request. To contribute to Leaflet, I recommend first checking this documentation [ManuBB](https://github.com/manubb/Leaflet.PixiOverlay). We welcome contributions of any kind, including bug fixes, code refactoring, and new features.

## Contact

For questions or suggestions, please contact us at `joaovba.dev@gmail.com`, or open an issue in the project repository at `https://github.com/your-username/app-mapa`. We are always interested in improving the project with community feedback.
