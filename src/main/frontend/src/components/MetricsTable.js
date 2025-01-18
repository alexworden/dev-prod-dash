import React, { useState } from 'react';
import SparklineChart from './SparklineChart';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  IconButton,
  Collapse,
  Box
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

// Manager metrics define the common metrics that appear in both manager and asset rows
const MANAGER_METRICS = [
  "Release Velocity",
  "P0 and P1 Incidents",
  "Interaction Latency",
  "Service Availability",
  "UI Availability"
];

// Asset metrics include all metrics, with the first few matching manager metrics
const ASSET_METRICS = [
  // These should align with manager metrics
  "Release Frequency",     // aligns with Release Velocity
  "P0 and P1 Incidents",
  "Interaction Latency",
  "Service Availability",
  "UI Availability",
  // Asset-specific metrics
  "Lead Time For Changes",
  "Code Complexity",
  "PRs Per Release",
  "PR Review Time",
  "Merge Time",
  "Build Time"
];

const AssetRow = ({ asset, indent }) => {
  // Debug logging to see what metrics are available
  console.log('Available metrics:', Object.keys(asset.metrics));
  
  return (
    <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
      <TableCell style={{ paddingLeft: `${indent * 40}px`, width: '200px' }}>
        <Typography variant="body2">{asset.assetName}</Typography>
      </TableCell>
      {ASSET_METRICS.map(metricName => {
        // Special handling for Code Complexity - three trend lines
        if (metricName === "Code Complexity") {
          const complexityData = asset.metrics[metricName];
          return (
            <TableCell key={metricName} align="center" sx={{ width: '120px' }}>
              {complexityData && (
                <SparklineChart 
                  data={complexityData.values}
                  isComplexityMetric={true}
                />
              )}
            </TableCell>
          );
        }

        // Special handling for PR Review Time - combine internal and external metrics
        if (metricName === "PR Review Time") {
          const internalReviewTime = asset.metrics["PR Review Time (Internal)"];
          const externalReviewTime = asset.metrics["PR Review Time (External)"];
          
          if (internalReviewTime?.values && externalReviewTime?.values) {
            return (
              <TableCell key={metricName} align="center" sx={{ width: '120px' }}>
                <SparklineChart 
                  data={internalReviewTime.values}
                  secondaryData={externalReviewTime.values}
                />
              </TableCell>
            );
          }
          return <TableCell key={metricName} align="center" sx={{ width: '120px' }} />;
        }

        // Special handling for Release Frequency to align with Release Velocity
        if (metricName === "Release Frequency") {
          const value = asset.metrics["Release Velocity"] || asset.metrics[metricName];
          return (
            <TableCell key={metricName} align="center" sx={{ width: '120px' }}>
              {value && <SparklineChart data={value.values} />}
            </TableCell>
          );
        }
        
        // Regular metrics
        const value = asset.metrics[metricName];
        return (
          <TableCell key={metricName} align="center" sx={{ width: '120px' }}>
            {value && <SparklineChart data={value.values} />}
          </TableCell>
        );
      })}
      <TableCell align="center" sx={{ width: '100px' }}>
        <Checkbox 
          checked={asset.autoMergeEnabled}
          disabled
          size="small"
        />
      </TableCell>
      <TableCell align="center" sx={{ width: '100px' }}>
        <Checkbox 
          checked={asset.qodoMergeEnabled}
          disabled
          size="small"
        />
      </TableCell>
    </TableRow>
  );
};

const AssetHeaderRow = () => (
  <TableRow>
    <TableCell sx={{ width: '200px', backgroundColor: '#81c784' }}>Asset Name</TableCell>
    {ASSET_METRICS.map(metric => (
      <TableCell key={metric} align="center" sx={{ width: '120px', backgroundColor: '#81c784' }}>
        <Typography variant="subtitle2" color="white">
          {metric}
        </Typography>
      </TableCell>
    ))}
    <TableCell align="center" sx={{ width: '100px', backgroundColor: '#81c784' }}>
      <Typography variant="subtitle2" color="white">
        Auto-Merge
      </Typography>
    </TableCell>
    <TableCell align="center" sx={{ width: '100px', backgroundColor: '#81c784' }}>
      <Typography variant="subtitle2" color="white">
        Qodo Merge
      </Typography>
    </TableCell>
  </TableRow>
);

const ManagerRow = ({ manager, indent = 0 }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: `${indent * 40}px`, width: '200px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ visibility: (manager.reports?.length > 0 || manager.assets?.length > 0) ? 'visible' : 'hidden' }}
          >
            {open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </IconButton>
          <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
            {manager.managerName}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            {manager.role}
          </Typography>
        </TableCell>
        {MANAGER_METRICS.map((metricName, index) => {
          const value = manager.metrics[metricName === "Release Velocity" ? "Release Velocity" : metricName];
          return (
            <TableCell key={metricName} align="center" sx={{ width: '120px' }}>
              {value && <SparklineChart data={value.values} />}
            </TableCell>
          );
        })}
        {/* Add empty cells for the remaining asset-specific columns */}
        {[...Array(ASSET_METRICS.length - MANAGER_METRICS.length + 2)].map((_, index) => (
          <TableCell key={`empty-${index}`} sx={{ width: index < ASSET_METRICS.length - MANAGER_METRICS.length ? '120px' : '100px' }} />
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={ASSET_METRICS.length + 3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* Render sub-managers first */}
              {manager.reports?.map(report => (
                <ManagerRow 
                  key={report.managerId} 
                  manager={report} 
                  indent={indent + 1}
                />
              ))}
              
              {/* Render assets after all sub-managers */}
              {manager.assets?.length > 0 && (
                <>
                  <AssetHeaderRow />
                  {manager.assets.map(asset => (
                    <AssetRow 
                      key={asset.assetName} 
                      asset={asset} 
                      indent={indent + 1}
                    />
                  ))}
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MetricsTable = ({ data }) => {
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'auto',
        '& .MuiTableHead-root': {
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: '#1976d2'
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          backgroundColor: '#1976d2',
          color: 'white',
          fontWeight: 'bold'
        }
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '200px' }}>
              <Typography variant="subtitle2">
                Name
              </Typography>
            </TableCell>
            {MANAGER_METRICS.map(metric => (
              <TableCell key={metric} align="center" sx={{ width: '120px' }}>
                <Typography variant="subtitle2">
                  {metric}
                </Typography>
              </TableCell>
            ))}
            {/* Add empty cells for the remaining asset-specific columns */}
            {[...Array(ASSET_METRICS.length - MANAGER_METRICS.length + 2)].map((_, index) => (
              <TableCell 
                key={`empty-${index}`} 
                sx={{ width: index < ASSET_METRICS.length - MANAGER_METRICS.length ? '120px' : '100px' }}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(director => (
            <ManagerRow key={director.managerId} manager={director} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MetricsTable;
