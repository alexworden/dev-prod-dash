package com.productivity.dashboard.controller;

import com.productivity.dashboard.model.ManagerMetrics;
import com.productivity.dashboard.service.MetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MetricsController {
    
    @Autowired
    private MetricsService metricsService;
    
    @GetMapping("/api/metrics")
    public List<ManagerMetrics> getMetrics() {
        return metricsService.getMetricsData();
    }
}
