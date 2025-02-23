package com.productivity.dashboard.service;

import com.productivity.dashboard.model.ManagerMetrics;
import com.productivity.dashboard.model.MetricsData;
import com.productivity.dashboard.model.AssetMetrics;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.IntStream;

@Service
public class MetricsService {
    private static final String[] MANAGER_METRICS = {
        "Release Frequency", "Lead Time for Changes", "Prod Incidents", "MTTR",
        "Service Availability", "UI Availability", "UI Latency"
    };
    
    private static final String[] ASSET_METRICS = {
        // These should align with manager metrics
        "Release Frequency", "Lead Time for Changes", "Prod Incidents", "MTTR",
        "Service Availability", "UI Availability", "UI Latency",
        // Asset-specific metrics
        "Code Complexity", "PRs Per Release", "PR Review Time (Internal)",
        "PR Review Time (External)", "Merge Time", "Build Time"
    };

    public List<ManagerMetrics> getMetricsData(String owningManagerId) {
        List<ManagerMetrics> directors = new ArrayList<>();
        
        // Generate 2 directors
        for (int i = 1; i <= 2; i++) {
            ManagerMetrics director = new ManagerMetrics();
            director.setManagerId("D" + i);
            director.setManagerName("Director " + i);
            director.setRole("DIRECTOR");
            director.setDirectorId(null);
            director.setMetrics(generateManagerMetrics());
            director.setAssets(generateAssets(2, director.getManagerId())); // Directors own some assets
            director.setReports(generateManagers(3, director.getManagerId())); // Each director has 3 managers
            directors.add(director);
        }
        
        return directors;
    }

    private List<ManagerMetrics> generateManagers(int count, String directorId) {
        List<ManagerMetrics> managers = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            ManagerMetrics manager = new ManagerMetrics();
            manager.setManagerId(directorId + "-M" + i);
            manager.setManagerName("Manager " + directorId + "-" + i);
            manager.setRole("MANAGER");
            manager.setDirectorId(directorId);
            manager.setMetrics(generateManagerMetrics());
            manager.setAssets(generateAssets(3, manager.getManagerId()));
            
            // Add sub-managers for the first manager of each director
            if (i == 1) {
                manager.setReports(generateSubManagers(2, manager.getManagerId()));
            } else {
                manager.setReports(new ArrayList<>());
            }
            
            managers.add(manager);
        }
        return managers;
    }

    private List<ManagerMetrics> generateSubManagers(int count, String managerId) {
        List<ManagerMetrics> subManagers = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            ManagerMetrics subManager = new ManagerMetrics();
            subManager.setManagerId(managerId + "-SM" + i);
            subManager.setManagerName("Sub-Manager " + managerId + "-" + i);
            subManager.setRole("SUB_MANAGER");
            subManager.setDirectorId(managerId);
            subManager.setMetrics(generateManagerMetrics());
            subManager.setAssets(generateAssets(2, subManager.getManagerId()));
            subManager.setReports(new ArrayList<>()); // Sub-managers don't have reports
            subManagers.add(subManager);
        }
        return subManagers;
    }

    private Map<String, MetricsData> generateManagerMetrics() {
        Map<String, MetricsData> metrics = new HashMap<>();
        for (String metricName : MANAGER_METRICS) {
            metrics.put(metricName, generateMetricsData(metricName, false));
        }
        return metrics;
    }

    private List<AssetMetrics> generateAssets(int count, String ownerId) {
        List<AssetMetrics> assets = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            AssetMetrics asset = new AssetMetrics();
            asset.setAssetName("Asset " + ownerId + "-" + i);
            asset.setOwnerId(ownerId);
            asset.setMetrics(generateAssetMetrics());
            asset.setAutoMergeEnabled(new Random().nextBoolean());
            asset.setQodoMergeEnabled(new Random().nextBoolean());
            assets.add(asset);
        }
        return assets;
    }

    private Map<String, MetricsData> generateAssetMetrics() {
        Map<String, MetricsData> metrics = new HashMap<>();
        for (String metricName : ASSET_METRICS) {
            boolean isDualMetric = metricName.equals("PR Review Time (Internal)") || 
                                 metricName.equals("PR Review Time (External)");
            metrics.put(metricName, generateMetricsData(metricName, isDualMetric));
        }
        return metrics;
    }

    private MetricsData generateMetricsData(String metricName, boolean isDualMetric) {
        MetricsData data = new MetricsData();
        data.setMetric(metricName);
        data.setTimeRange("Last 6 months");
        
        List<Double> values = new ArrayList<>();
        Random random = new Random();
        
        switch (metricName) {
            case "Lead Time for Changes":
                // Lead time in days, typically between 1-14 days with occasional spikes
                double baseLeadTime = random.nextDouble() * 5 + 2; // Base of 2-7 days
                IntStream.range(0, 6).forEach(i -> {
                    double variation = (random.nextDouble() - 0.4) * 4; // Slight tendency to improve
                    values.add(Math.max(1.0, Math.min(14.0, baseLeadTime + variation)));
                });
                break;
                
            case "Prod Incidents":
                // Number of production incidents per month, typically 0-5
                double baseIncidents = random.nextDouble() * 2 + 1; // Base of 1-3 incidents
                IntStream.range(0, 6).forEach(i -> {
                    double variation = (random.nextDouble() - 0.6) * 2; // Trend toward fewer incidents
                    values.add(Math.max(0.0, Math.min(5.0, baseIncidents + variation)));
                });
                break;
                
            case "MTTR":
                // Mean Time To Recovery in hours, typically between 0.5-8 hours
                double baseMTTR = random.nextDouble() * 2 + 1; // Base of 1-3 hours
                IntStream.range(0, 6).forEach(i -> {
                    double variation = (random.nextDouble() - 0.5) * 2;
                    values.add(Math.max(0.5, Math.min(8.0, baseMTTR + variation)));
                });
                break;
                
            case "Code Complexity":
                // Generate three sets of values for different complexity levels
                List<Double> highComplexity = new ArrayList<>();    // >20 cyclomatic complexity
                List<Double> mediumComplexity = new ArrayList<>();  // 11-20 cyclomatic complexity
                List<Double> lowComplexity = new ArrayList<>();     // 5-10 cyclomatic complexity
                
                // Start with realistic initial values
                double highBase = random.nextDouble() * 5 + 2;     // 2-7 high complexity items
                double mediumBase = random.nextDouble() * 10 + 8;   // 8-18 medium complexity items
                double lowBase = random.nextDouble() * 15 + 10;     // 10-25 low complexity items
                
                IntStream.range(0, 6).forEach(i -> {
                    // High complexity should generally decrease or stay low
                    double highVariation = (random.nextDouble() - 0.6) * 2; // Trend downward
                    highComplexity.add(Math.max(0, Math.min(10, highBase + highVariation)));
                    
                    // Medium complexity should fluctuate but generally stay stable
                    double mediumVariation = (random.nextDouble() - 0.5) * 4;
                    mediumComplexity.add(Math.max(0, Math.min(20, mediumBase + mediumVariation)));
                    
                    // Low complexity might increase as code is refactored
                    double lowVariation = (random.nextDouble() - 0.4) * 5; // Slight upward trend
                    lowComplexity.add(Math.max(0, Math.min(30, lowBase + lowVariation)));
                });
                
                // Combine all complexity values
                values.addAll(highComplexity);
                values.addAll(mediumComplexity);
                values.addAll(lowComplexity);
                break;
                
            default:
                if (isDualMetric) {
                    // For dual metrics (internal vs external PR times), generate two sets of values
                    List<Double> internalValues = new ArrayList<>();
                    List<Double> externalValues = new ArrayList<>();
                    double baseValue = random.nextDouble() * 100;
                    
                    IntStream.range(0, 6).forEach(i -> {
                        double internalVariation = (random.nextDouble() - 0.5) * 10;
                        double externalVariation = (random.nextDouble() - 0.5) * 20;
                        internalValues.add(Math.max(0, Math.min(100, baseValue + internalVariation)));
                        externalValues.add(Math.max(0, Math.min(100, baseValue * 1.5 + externalVariation)));
                    });
                    
                    // Combine both sets of values
                    values.addAll(internalValues);
                    values.addAll(externalValues);
                } else {
                    // For other metrics, generate standard values between 0-100
                    double baseValue = random.nextDouble() * 100;
                    IntStream.range(0, 6).forEach(i -> {
                        double variation = (random.nextDouble() - 0.5) * 20;
                        values.add(Math.max(0, Math.min(100, baseValue + variation)));
                    });
                }
        }
        
        data.setValues(values);
        return data;
    }
}
