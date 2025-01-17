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

## Available Metrics

### Manager Level Metrics
- Release Velocity
- P0 and P1 Incidents
- Interaction Latency
- Service Availability
- UI Availability

### Project Level Metrics
- Release Frequency
- Lead Time For Changes
- Code Complexity
- P0 and P1 Incidents
- Service Availability
- UI Availability
