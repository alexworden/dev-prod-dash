package com.productivity.dashboard.model;

import lombok.Data;
import java.util.List;

@Data
public class MetricsData {
    private List<Double> values;
    private String metric;
    private String timeRange;
}
