package com.productivity.dashboard.model;

import lombok.Data;
import java.util.Map;

@Data
public class AssetMetrics {
    private String assetName;
    private Map<String, MetricsData> metrics; // Key is metric name
    private String ownerId; // Can be either director or manager ID
    private boolean autoMergeEnabled;
    private boolean qodoMergeEnabled;
}
