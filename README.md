# Development Productivity Dashboard

A modern web application that displays productivity metrics for engineering organizations. Built with Spring Boot and React.

## Features

- Hierarchical view of engineering metrics by manager and project
- Interactive sparkline graphs for various metrics
- Collapsible rows to show/hide project details
- Modern Material-UI design
- Single server deployment (frontend served from backend)

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Node.js and npm (automatically managed by Maven)

## Building and Running

1. Clone the repository
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Open your browser and navigate to http://localhost:8080

## Development

The application consists of two main parts:

1. Backend (Spring Boot)
   - Located in `src/main/java`
   - Provides REST API endpoints
   - Serves the frontend static files

2. Frontend (React)
   - Located in `src/main/frontend`
   - Built with React and Material-UI
   - Uses Recharts for sparkline graphs

### Hot Reloading

For a better development experience, you can enable hot reloading for both backend and frontend changes:

#### Backend (Java) Hot Reloading
1. Run the application with the dev profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```
2. Install the JRebel plugin in your IDE
3. Enable JRebel for the project
4. Run the application with JRebel enabled

#### Frontend Hot Reloading
1. In one terminal, start the backend:
   ```bash
   mvn spring-boot:run
   ```
2. In another terminal, navigate to the frontend directory and start the development server:
   ```bash
   cd src/main/frontend
   npm start
   ```
3. The frontend will be available at http://localhost:3000 with hot reloading enabled

## Available Metrics

### Manager Level Metrics
- Release Frequency
- Lead Time for Changes
- Prod Incidents
- MTTR (Mean Time To Recovery)
- Service Availability
- UI Availability
- UI Latency

### Asset Level Metrics
All manager level metrics plus:
- Code Complexity
- PRs Per Release
- PR Review Time
- Merge Time
- Build Time
