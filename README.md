# Delivery Route Optimization Tool

## Overview
This project focuses on optimizing delivery routes to minimize travel distance, reduce carbon emissions, and maximize the efficiency of truck usage, all while keeping costs down. The tool leverages the **Clarke and Wright Savings Algorithm** to calculate the best possible routes for freight deliveries from a central warehouse to multiple demand points.

## Features
- **Route Optimization:** Generates optimal routes for deliveries, minimizing travel distance and carbon footprint.
- **Warehouse-Based Deliveries:** Start from a central warehouse and optimize delivery to demand points across the region.
- **Efficient Truck Usage:** Calculates how many trucks are needed based on capacity and demand at each point (e.g., truck capacity set to 25 tonnes).
- **Visual Results:** Displays optimized routes on an interactive map where each cycle represents a round-trip starting and ending at the warehouse.
- **Cost and Environmental Impact Reduction:** Focus on reducing operational costs and lowering emissions by planning efficient routes.

## How It Works
1. **Enter Warehouse Information:**  
   Start by entering the location of the warehouse. For this demo, we use a warehouse in Indiana, USA, by entering its pincode.
   
2. **Define Truck Capacity:**  
   Specify the truck capacity in tons.

3. **Add Demand Points:**  
   Enter the pincode and freight demand (in tonnes) for each demand point.

4. **Calculate Optimal Routes:**  
   After submitting the data, the tool calculates the most efficient routes, ensuring minimal travel distance while maximizing truck capacity.

5. **Visualize the Results:**  
   View the optimized routes on a map. Each route forms a cycle starting and ending at the warehouse. The system also calculates the number of trucks required for the input demands.

## Usage
To use the delivery route optimization tool:

1. Clone the repository:
   ```bash
   git clone https://github.com/username/route-optimization-tool.git](https://github.com/rahulharpal1603/walmart.git
2. Install the required dependencies (Run the command below inside the "walmart" folder):
    ```bash
    cd ./FrontEnd/VSP_Problem
    npm install
2. Run the application:
    ```bash
    npm run dev

## Demo

Check out the live demo [here](https://walmart-nine.vercel.app/).

In the demo, you'll be guided through the process of entering the warehouse location, truck capacity, and demand points. The results page will show the optimized routes along with the number of trucks required for the inputted demands.

## Technologies Used

* **Frontend:** HTML, CSS, JavaScript, React
* **Backend:** Python-fastAPI
* **Algorithm:** Clarke and Wright Savings Algorithm
* **Map Visualization:** Leaflet

## Team

This project was developed by **Team CodeCrafters** as a part of submission for Walmart Sparkathon 2024.
   
