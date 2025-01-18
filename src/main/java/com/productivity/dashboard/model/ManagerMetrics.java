package com.productivity.dashboard.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ManagerMetrics {
    private String managerId;
    private String managerName;
    private String role; // "DIRECTOR" or "MANAGER"
    private String directorId; // null if this is a director
    private Map<String, MetricsData> metrics;
    private List<AssetMetrics> assets;
    private List<ManagerMetrics> reports; // Direct reports (managers under this director)
}
