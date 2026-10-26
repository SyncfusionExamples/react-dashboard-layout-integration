import React, { useState, useEffect } from 'react';
import { DashboardLayoutComponent, PanelsDirective, PanelDirective } from '@syncfusion/ej2-react-layouts';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';
import '@syncfusion/ej2-material-theme/styles/material.css';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PanelLayout {
  id: string;
  row: number;
  col: number;
  sizeX: number;
  sizeY: number;
  minSizeX?: number;
  minSizeY?: number;
}

interface SalesData {
  id: number;
  product: string;
  sales: number;
  revenue: number;
  quarter: string;
  region: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_SALES_DATA: SalesData[] = [
  { id: 1, product: 'Product A', sales: 150, revenue: 45000, quarter: 'Q1', region: 'North' },
  { id: 2, product: 'Product B', sales: 200, revenue: 72000, quarter: 'Q1', region: 'South' },
  { id: 3, product: 'Product C', sales: 120, revenue: 36000, quarter: 'Q2', region: 'East' },
  { id: 4, product: 'Product D', sales: 180, revenue: 63000, quarter: 'Q2', region: 'West' },
  { id: 5, product: 'Product E', sales: 210, revenue: 84000, quarter: 'Q3', region: 'North' },
  { id: 6, product: 'Product F', sales: 170, revenue: 61000, quarter: 'Q3', region: 'South' },
  { id: 7, product: 'Product G', sales: 190, revenue: 76000, quarter: 'Q4', region: 'East' },
  { id: 8, product: 'Product H', sales: 160, revenue: 56000, quarter: 'Q4', region: 'West' },
];

// ============================================================================
// AG GRID COLUMN DEFINITIONS
// ============================================================================

const AG_GRID_COLUMNS: ColDef<SalesData>[] = [
  { field: 'id', headerName: 'ID', width: 60, pinned: 'left' },
  { field: 'product', headerName: 'Product', width: 120 },
  { field: 'sales', headerName: 'Sales Units', width: 120, type: 'rightAligned' },
  { field: 'revenue', headerName: 'Revenue ($)', width: 140, type: 'rightAligned' },
  { field: 'quarter', headerName: 'Quarter', width: 100 },
  { field: 'region', headerName: 'Region', width: 100 },
];

// ============================================================================
// COMPONENT: AG GRID DATA TABLE PANEL
// ============================================================================

interface DataTablePanelProps {
  data: SalesData[];
}

const DataTablePanel: React.FC<DataTablePanelProps> = ({ data }) => {
  const onGridReady = (params: GridReadyEvent<SalesData>) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="panel-content data-table-panel">
      <div className="panel-header">
        <h3>Sales Data (AG Grid Community)</h3>
        <p className="panel-description">Real-time sales metrics with sorting & filtering</p>
      </div>
      <div className="ag-theme-quartz" style={{ width: '100%', height: '100%' }}>
        <AgGridReact
          columnDefs={AG_GRID_COLUMNS}
          rowData={data}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={5}
        />
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: PLOTLY CHART PANEL
// ============================================================================

interface ChartPanelProps {
  title: string;
  type: 'scatter' | 'line' | 'bar' | 'pie';
  data: Data[];
}

const ChartPanel: React.FC<ChartPanelProps> = ({ title, type, data }) => {
  const renderChart = () => {
    switch (type) {
      case 'scatter':
        return (
          <Plot
            data={data}
            layout={{
              title: title,
              xaxis: { title: 'Sales Units' },
              yaxis: { title: 'Revenue ($)' },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#333' },
            } as Partial<Layout>}
            style={{ width: '100%', height: '100%' }}
            config={{ responsive: true }}
          />
        );
      case 'bar':
        return (
          <Plot
            data={data}
            layout={{
              title: title,
              xaxis: { title: 'Product' },
              yaxis: { title: 'Revenue ($)' },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#333' },
              barmode: 'group',
            } as Partial<Layout>}
            style={{ width: '100%', height: '100%' }}
            config={{ responsive: true }}
          />
        );
      case 'pie':
        return (
          <Plot
            data={data}
            layout={{
              title: title,
              paper_bgcolor: 'transparent',
              font: { color: '#333' },
            } as Partial<Layout>}
            style={{ width: '100%', height: '100%' }}
            config={{ responsive: true }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="panel-content chart-panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <p className="panel-description">Interactive visualization powered by Plotly</p>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        {renderChart()}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export const PresaleDashboardSample: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Detect screen size changes for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDefaultLayout = (): PanelLayout[] => {
    return isMobile
      ? [
          { id: 'panel-1', row: 0, col: 0, sizeX: 12, sizeY: 4, minSizeX: 12, minSizeY: 3 },
          { id: 'panel-2', row: 4, col: 0, sizeX: 12, sizeY: 5, minSizeX: 12, minSizeY: 4 },
          { id: 'panel-3', row: 9, col: 0, sizeX: 12, sizeY: 4, minSizeX: 12, minSizeY: 3 },
          { id: 'panel-4', row: 13, col: 0, sizeX: 12, sizeY: 4, minSizeX: 12, minSizeY: 3 },
        ]
      : [
          { id: 'panel-1', row: 0, col: 0, sizeX: 6, sizeY: 5, minSizeX: 4, minSizeY: 4 },
          { id: 'panel-2', row: 0, col: 6, sizeX: 6, sizeY: 5, minSizeX: 4, minSizeY: 4 },
          { id: 'panel-3', row: 5, col: 0, sizeX: 12, sizeY: 5, minSizeX: 6, minSizeY: 4 },
          { id: 'panel-4', row: 10, col: 0, sizeX: 6, sizeY: 4, minSizeX: 4, minSizeY: 3 },
        ];
  };

  const panelLayout = getDefaultLayout();

  // Prepare Plotly chart data
  const scatterData: Data[] = [{
    x: SAMPLE_SALES_DATA.map(d => d.sales),
    y: SAMPLE_SALES_DATA.map(d => d.revenue),
    mode: 'markers',
    type: 'scatter',
    marker: { size: 12, color: '#0066ff' },
    text: SAMPLE_SALES_DATA.map(d => d.product),
    hovertemplate: '<b>%{text}</b><br>Sales: %{x}<br>Revenue: $%{y}',
  }];

  const barData: Data[] = [{
    x: SAMPLE_SALES_DATA.slice(0, 4).map(d => d.product),
    y: SAMPLE_SALES_DATA.slice(0, 4).map(d => d.revenue),
    type: 'bar',
    marker: { color: '#00b4d8' },
  }];

  const pieData: Data[] = [{
    values: SAMPLE_SALES_DATA.map(d => d.revenue),
    labels: SAMPLE_SALES_DATA.map(d => d.product),
    type: 'pie',
  }];

  return (
    <div className={`presale-dashboard ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="dashboard-controls">
        <div className="controls-header">
          <h1>📊 Syncfusion Dashboard + AG Grid + Plotly</h1>
          <p className="subtitle">Presale Technical Evaluation Sample</p>
        </div>
      </div>

      {/* Dashboard Container */}
      <div className="dashboard-container">
        <div className="dashboard-layout-frame">
          <DashboardLayoutComponent
            cellSpacing={[10, 10]}
            columns={12}
            allowResizing={true}
            enablePersistence={true}
          >
            <PanelsDirective>
            {/* Panel 1: Sales Data Table */}
            <PanelDirective
              id="panel-1"
              header="Sales Data Table"
              content={() => <DataTablePanel data={SAMPLE_SALES_DATA} />}
              row={panelLayout[0].row}
              col={panelLayout[0].col}
              sizeX={panelLayout[0].sizeX}
              sizeY={panelLayout[0].sizeY}
              minSizeX={panelLayout[0].minSizeX}
              minSizeY={panelLayout[0].minSizeY}
            />

            {/* Panel 2: Scatter Chart */}
            <PanelDirective
              id="panel-2"
              header="Sales vs Revenue Scatter"
              content={() => <ChartPanel title="Sales Units vs Revenue" type="scatter" data={scatterData} />}
              row={panelLayout[1].row}
              col={panelLayout[1].col}
              sizeX={panelLayout[1].sizeX}
              sizeY={panelLayout[1].sizeY}
              minSizeX={panelLayout[1].minSizeX}
              minSizeY={panelLayout[1].minSizeY}
            />

            {/* Panel 3: Revenue Bar Chart */}
            <PanelDirective
              id="panel-3"
              header="Revenue by Product"
              content={() => <ChartPanel title="Revenue Distribution" type="bar" data={barData} />}
              row={panelLayout[2].row}
              col={panelLayout[2].col}
              sizeX={panelLayout[2].sizeX}
              sizeY={panelLayout[2].sizeY}
              minSizeX={panelLayout[2].minSizeX}
              minSizeY={panelLayout[2].minSizeY}
            />

            {/* Panel 4: Revenue Pie Chart */}
            <PanelDirective
              id="panel-4"
              header="Revenue Share"
              content={() => <ChartPanel title="Revenue Share by Product" type="pie" data={pieData} />}
              row={panelLayout[3].row}
              col={panelLayout[3].col}
              sizeX={panelLayout[3].sizeX}
              sizeY={panelLayout[3].sizeY}
              minSizeX={panelLayout[3].minSizeX}
              minSizeY={panelLayout[3].minSizeY}
            />
            </PanelsDirective>
          </DashboardLayoutComponent>
        </div>
      </div>
    </div>
  );
};

export default PresaleDashboardSample;
