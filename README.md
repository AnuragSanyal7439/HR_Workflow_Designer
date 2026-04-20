# HR Workflow Designer

## Overview

HR Workflow Designer is a React and TypeScript workflow-building application for creating, configuring, validating, simulating, importing, and exporting HR process flows. It provides a drag-and-drop canvas powered by React Flow, centralized workflow state with Zustand, and a modular architecture designed for adding more node types and workflow capabilities over time.

The current implementation focuses on a clean editor experience for HR-style workflows such as onboarding, leave approval, task assignment, approvals, and automated steps.

## Features

### Required Features

- Three-panel layout with a left node palette, central workflow canvas, and right configuration panel.
- React Flow canvas with custom nodes, edges, background, controls, and minimap.
- Drag-and-drop node creation from the palette.
- Supported node types: Start, Task, Approval, Automated Step, and End.
- Zustand-backed workflow state for nodes, edges, selection, validation, history, and editor actions.
- Node selection with contextual configuration forms.
- Dynamic forms based on node type.
- Real-time validation for workflow structure and required node configuration.
- Workflow simulation with step-by-step execution output.
- JSON export and import with basic structure validation.
- Auto layout for arranging workflow nodes in a readable top-to-bottom flow.

### Bonus Features

- Undo and redo using snapshot-based workflow history.
- Workflow templates for Onboarding Flow and Leave Approval Flow.
- Lightweight per-node version history for configuration changes.
- Mock API integration for Automated Step actions.
- Validation indicators directly on affected nodes.
- Clean Recent Changes panel that records meaningful field updates after editing is complete.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Flow
- Zustand
- ESLint

## Architecture Overview

The project is organized by responsibility to keep UI, state, types, and workflow logic separate.

- `src/components`: Layout, palette, canvas, config panel, forms, simulation panel, validation summary, and JSON import/export UI.
- `src/nodes`: Custom React Flow node renderer, node type registration, and node factory helpers.
- `src/store`: Zustand workflow store for graph state and editor actions.
- `src/types`: Shared workflow, automation, and template types.
- `src/utils`: Workflow validation, simulation, serialization, history, auto layout, and template insertion utilities.
- `src/api`: Mock automation API for Automated Step configuration.
- `src/templates`: Reusable workflow template definitions.
- `src/hooks`: Shared UI hooks, including local draft state for form editing.

Core workflow state lives in the Zustand store. UI components call store actions instead of owning graph logic directly. Workflow utilities are kept outside components so validation, simulation, import/export, auto-layout, and history can be reused consistently.

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Demo Steps

1. Start the app with `npm run dev`.
2. Drag a Start node from the left palette into the canvas.
3. Add Task, Approval, Automated Step, and End nodes.
4. Connect the nodes in order from Start to End.
5. Select each node and edit its configuration in the right panel.
6. For an Automated Step, choose an action and fill in its generated parameters.
7. Confirm validation status near the workflow action buttons.
8. Click Run Simulation to view the ordered execution log.
9. Click Auto Layout to arrange the graph vertically.
10. Use Export JSON to copy the workflow definition.
11. Use Import JSON to paste a valid workflow back into the editor.
12. Try Undo and Redo after creating nodes, editing config, connecting nodes, importing JSON, or applying auto layout.
13. Insert the Onboarding Flow or Leave Approval Flow template from the palette and run the same validation/simulation flow.

## Design Decisions

- React Flow is used for graph rendering because it provides reliable node positioning, connections, controls, minimap support, and drag-and-drop integration.
- Zustand is used for workflow state because the editor needs shared state across the canvas, config panel, validation summary, simulation panel, and import/export controls.
- Node configuration forms are split by node type to keep each form small and extensible.
- Workflow validation, simulation, serialization, auto layout, and template insertion live in utility modules instead of UI components.
- Node version history records changes on blur rather than on every keypress so the Recent Changes panel stays readable.
- Undo and redo use workflow snapshots for predictable restoration across different editor actions.
- Automated Step actions are loaded through a mock API module to keep integration boundaries clear.

## Assumptions

- A valid workflow has exactly one Start node and at least one End node.
- The current traversal model expects a simple connected flow from Start toward End.
- Start nodes are limited to one per workflow.
- Task and Approval nodes can be repeated.
- End nodes can be repeated.
- Automated Step actions are mocked locally and do not call a real backend.
- Imported workflows are trusted after structural validation and are not persisted to a database.
- Node version history is intended for lightweight visibility, not full audit compliance.

## Known Limitations

- Workflow traversal is intentionally simple and does not fully support complex branching, loops, or parallel execution.
- Validation covers core structure and required fields but is not a complete business-rules engine.
- Import validation protects against malformed JSON and invalid node types, but it does not deeply validate every possible field shape.
- Changes are stored in memory only; refreshing the page clears the current workflow.
- Version history tracks configuration updates only and does not track node movement or edge changes.
- Automated Step integration uses mock data only.
- The configuration panel is functional but intentionally minimal in visual complexity.

## Future Improvements

- Add persistent storage for saved workflows.
- Support branching conditions and decision nodes.
- Add richer validation rules for HR-specific workflow policies.
- Add template preview before insertion.
- Add workflow names, metadata, and save/load management.
- Add export formats beyond JSON, such as image or PDF.
- Add collaborative editing and role-based permissions.
- Add real API integration for automations, assignees, roles, and HR systems.
- Add unit tests for workflow utilities and component tests for key editor flows.
- Improve accessibility and keyboard-first graph editing.
