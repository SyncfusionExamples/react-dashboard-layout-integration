# Syncfusion React Dashboard Layout Sample

This sample shows how to use the **Syncfusion React Dashboard Layout** component (`DashboardLayoutComponent`) in a React 19 + TypeScript + Vite application.

It demonstrates:

- Draggable and resizable dashboard panels.
- Responsive behavior on desktop and smaller screens.
- Saving and restoring the panel layout with the component's built-in persistence.
- Rendering your own React components inside panels.
- Hosting the app under a configurable base path.

## Features

### 1. Draggable and resizable panels

The dashboard is a 12-column grid. Each `PanelDirective` defines its position (`row`, `col`), size (`sizeX`, `sizeY`) and minimum size. `allowResizing` lets users resize panels, and panels can be dragged to rearrange them.

```tsx
import { DashboardLayoutComponent, PanelsDirective, PanelDirective } from '@syncfusion/ej2-react-layouts';

<DashboardLayoutComponent
  cellSpacing={[10, 10]}
  columns={12}
  allowResizing={true}
  enablePersistence={true}
>
  <PanelsDirective>
    <PanelDirective
      id="panel-1"
      header="Panel 1"
      content={() => <MyPanelContent />}
      row={0} col={0} sizeX={6} sizeY={5} minSizeX={4} minSizeY={4}
    />
    {/* more panels ... */}
  </PanelsDirective>
</DashboardLayoutComponent>
```

`minSizeX` and `minSizeY` stop a panel from being resized below a usable size.

### 2. React components as panel content

The `content` property of a panel takes a function that returns any React element. Each panel's content is a regular React component, so the dashboard stays declarative and panels are easy to add, remove or replace.

The component fills the panel, so give the content a full-size container:

```tsx
const MyPanelContent: React.FC = () => (
  <div className="panel-content" style={{ width: '100%', height: '100%' }}>
    {/* your component */}
  </div>
);
```

### 3. Responsive layout

The sample tracks the window width and chooses a different panel arrangement below 600 px. On small screens the panels stack in a single full-width column. On larger screens they use a multi-column arrangement.

```tsx
const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 600);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const layout = isMobile
  ? [{ id: 'panel-1', row: 0, col: 0, sizeX: 12, sizeY: 4, minSizeX: 12, minSizeY: 3 } /* ... */]
  : [{ id: 'panel-1', row: 0, col: 0, sizeX: 6,  sizeY: 5, minSizeX: 4,  minSizeY: 4 } /* ... */];
```

The panel values come from this layout:

```tsx
<PanelDirective
  id="panel-1"
  row={layout[0].row}
  col={layout[0].col}
  sizeX={layout[0].sizeX}
  sizeY={layout[0].sizeY}
  minSizeX={layout[0].minSizeX}
  minSizeY={layout[0].minSizeY}
  /* header, content ... */
/>
```

### 4. Saving and restoring the layout

The sample uses the component's built-in persistence, `enablePersistence={true}`. When it is enabled, the component stores the panel positions and sizes in the browser and restores them when the page reloads. Each panel needs a stable, unique `id`, because the saved layout is matched to panels by `id`.

```tsx
<DashboardLayoutComponent enablePersistence={true} /* ... */>
```

### 5. Theming

The Material theme is imported once in `src/App.tsx`:

```tsx
import '@syncfusion/ej2-material-theme/styles/material.css';
```

### 6. Configurable base path

The app is built for the base path `/react-dashboard-layout-integration` by default. Set the `BASE_PATH` environment variable to change it, or to `/` for root hosting. `vite.config.js` applies it to every generated asset URL.

```js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = process.env.BASE_PATH ?? env.BASE_PATH ?? '/react-dashboard-layout-integration'
  const base = `/${raw.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
  return { base, plugins: [react()] }
})
```

`server.js` is a small Node server for the production build. It:

- serves `dist/` under `BASE_PATH`;
- redirects `/` and `/<base>` to `/<base>/`;
- falls back to `index.html` for routes without a file extension;
- returns 404 for missing files and blocks path traversal;
- answers `GET /healthz` for health checks;
- reads the port from the `PORT` environment variable (default `8080`).

## Integration notes

- `DashboardLayoutComponent` is provided by the `@syncfusion/ej2-react-layouts` package, with styles from `@syncfusion/ej2-material-theme`.
- Panel content is plain React, so the component does not need to know what it hosts.
- Panel content should use `width: 100%` and `height: 100%` so it follows panel resizing.
- Syncfusion components require a valid Syncfusion license for use in applications. See the Syncfusion licensing documentation for the terms that apply to your use.

## Folder Structure

```text
react-dashboard-layout-integration/
├── public/                # Static assets (favicon)
├── src/
│   ├── App.tsx            # Dashboard Layout and panel definitions
│   ├── App.css            # Dashboard and panel styles
│   ├── index.css          # Global styles
│   ├── main.tsx           # React entry point
│   └── vite-env.d.ts      # Vite type declarations
├── index.html             # HTML entry point
├── server.js              # Production server with base path support
├── vite.config.js         # Vite config, including the base path
├── eslint.config.js       # ESLint configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## How to Run the Sample

### Requirements

- Node.js 22 or later
- npm

### Install and start

```bash
npm install
npm run dev
```

Open the URL printed in the terminal. In development the app is served from the configured base path, `/react-dashboard-layout-integration/` by default.

### Production build

```bash
npm run build
npm start        # http://localhost:8080/react-dashboard-layout-integration/
```

To use a different base path, set `BASE_PATH` for **both** the build and the server:

```bash
BASE_PATH=/my-path npm run build
BASE_PATH=/my-path npm start
```

Behind a proxy or load balancer, forward the full base path to the app without rewriting it.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm start` | Serve `dist/` with `server.js` |
| `npm run preview` | Preview the build with Vite |
| `npm run lint` | Run ESLint |
