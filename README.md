# Syncfusion React Dashboard Layout Sample

## Description and Purpose

This sample shows how to use the **Syncfusion React Dashboard Layout** component (`DashboardLayoutComponent`) to build a responsive, interactive sales dashboard with React 19, TypeScript and Vite.

The dashboard is a 12-column grid of four panels (a data table and three charts) filled with sample sales data. Users can drag panels around and resize them, and the layout adapts to small screens. The sample is meant as a starting point for evaluating the Dashboard Layout component and for hosting it in production, including under a sub-path (for example Azure Linux App Service behind a Google Cloud Load Balancer).

## Features

### 1. Panel-based 12-column grid

`DashboardLayoutComponent` splits the container into 12 columns. Each `PanelDirective` sets its position and size in grid cells. Its `content` is any React component.

```tsx
<DashboardLayoutComponent cellSpacing={[10, 10]} columns={12} allowResizing={true} enablePersistence={true}>
  <PanelsDirective>
    <PanelDirective
      id="panel-1"
      header="Sales Data Table"
      content={() => <DataTablePanel data={SAMPLE_SALES_DATA} />}
      row={0} col={0} sizeX={6} sizeY={5} minSizeX={4} minSizeY={4}
    />
    {/* panel-2, panel-3, panel-4 ... */}
  </PanelsDirective>
</DashboardLayoutComponent>
```

### 2. Drag and resize

`allowResizing` lets users resize panels. Panels can be dragged by their header. `minSizeX` and `minSizeY` keep each panel from becoming too small to use.

### 3. Layout persistence

`enablePersistence={true}` saves the user's panel arrangement in the browser, so it is restored on reload.

### 4. Responsive layout

The app tracks the window width and picks a different panel layout for screens narrower than 600 px. On mobile, panels stack in a single full-width column.

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

### 5. Panel content as React components

Each panel renders its own component through the `content` template, so the dashboard stays declarative and each panel is easy to replace.

| Panel | Header | Position (desktop) |
| --- | --- | --- |
| `panel-1` | Sales Data Table | row 0, col 0, 6x5 |
| `panel-2` | Sales vs Revenue Scatter | row 0, col 6, 6x5 |
| `panel-3` | Revenue by Product | row 5, col 0, 12x5 |
| `panel-4` | Revenue Share | row 10, col 0, 6x4 |

### 6. Theming

The Material theme for the Dashboard Layout is imported once in `src/App.tsx`:

```tsx
import '@syncfusion/ej2-material-theme/styles/material.css';
```

### 7. Sub-path hosting (Azure Linux App Service + Google Load Balancer)

- **Configurable base path.** `vite.config.js` reads the `BASE_PATH` environment variable at build time (default `/`) and normalizes it to the `/segment/` form. All asset URLs, including the favicon, are generated under that path.

  ```js
  export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const raw = process.env.BASE_PATH ?? env.BASE_PATH ?? '/'
    const base = `/${raw.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
    return { base, plugins: [react()] }
  })
  ```

- **Production server.** `server.js` is a dependency-free Node server (`npm start`) that serves `dist/` under `BASE_PATH`. It:
  - listens on `process.env.PORT`, which App Service provides
  - redirects `/` and `/<base>` to `/<base>/`
  - falls back to `index.html` for extension-less routes (SPA fallback)
  - returns a real `404` for missing files, and `403` for path traversal
  - sets long-lived cache headers on hashed `assets/` files and `no-cache` on `index.html`
  - exposes `GET /healthz` for App Service and load balancer health checks
  - adds basic security headers, and allows only `GET` and `HEAD`

## Folder Structure

```text
react-dashboard-layout-integration/
├── public/                 # Static files copied as-is (favicon, icons)
├── src/
│   ├── App.tsx             # Dashboard Layout, panels, sample data, responsive logic
│   ├── App.css             # Dashboard and panel styles
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite type declarations
├── index.html              # HTML template
├── vite.config.js          # Vite config, including BASE_PATH support
├── server.js               # Production server for App Service (base path, SPA fallback, /healthz)
├── eslint.config.js        # ESLint configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts and dependencies
```

## How to Run the Sample

### Requirements

- Node.js 22 or later and npm

### Run locally

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`). In development the app is served from `/react-dashboard-layout-integration/` unless `BASE_PATH` is set.

### Production build and preview

```bash
# Default base path: /react-dashboard-layout-integration
npm run build
npm start                     # http://localhost:8080/react-dashboard-layout-integration/

# Custom base path, or BASE_PATH=/ for root hosting
BASE_PATH=/custom npm run build
BASE_PATH=/custom npm start   # http://localhost:8080/custom/
```

`BASE_PATH` must have the same value at **build time** (for asset URLs) and at **run time** (for the server).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm start` | Serve `dist/` with `server.js` |
| `npm run preview` | Preview the build with Vite |
| `npm run lint` | Run ESLint |

### Deploy to Azure Linux App Service

1. Create a **Linux** App Service with a **Node 22 LTS** runtime.
2. Build the app (the base path defaults to `/react-dashboard-layout-integration`): `npm run build`.
3. Deploy the project, including `dist/`, `server.js` and `package.json`, using zip deploy, GitHub Actions or `az webapp deploy`. Alternatively, enable build during deployment and run the build there.
4. In **Configuration > Application settings**, add `BASE_PATH` only if you use a value other than the default `/react-dashboard-layout-integration`; it must match the build-time value.
5. In **Configuration > General settings**, set the **Startup Command** to `npm start`.
6. Set the **Health check** path to `/healthz`.

### Map a custom domain with Google Cloud Load Balancer

1. Create an **internet NEG** (fully qualified domain name and port) pointing at `<app-name>.azurewebsites.net` on port 443 with HTTPS, and use it as the backend service.
2. Set the load balancer's **host header** to the App Service hostname, with a custom request header such as `Host: <app-name>.azurewebsites.net`. This makes App Service route the request correctly.
3. Add a Google-managed certificate for your custom domain to the HTTPS frontend, and point the domain's DNS `A` record to the load balancer IP.
4. If the sample is served under a sub-path, add a URL map path rule that forwards `/react-dashboard-layout-integration/*` **without rewriting the path**. The app expects to receive the full `/react-dashboard-layout-integration/...` path.
5. Use `/healthz` as the backend health check path.

Because assets are emitted with the `BASE_PATH` prefix, the app works the same way on the `azurewebsites.net` URL and on the custom domain.
