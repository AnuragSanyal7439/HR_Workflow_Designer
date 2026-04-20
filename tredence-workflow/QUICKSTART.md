# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### 1. Start the Dev Server
```bash
cd "c:/Users/Anurag Sanyal/OneDrive/Desktop/Tredence/tredence-workflow"
npm run dev
```

Open your browser to: **http://localhost:5174/**

### 2. Create Your First Workflow

1. **Drag nodes** from the left panel onto the canvas
   - Start node
   - Task node
   - Approval node
   - Automated node
   - End node

2. **Connect nodes** by dragging from the bottom handle of one node to the top handle of another

3. **Configure nodes** by clicking on them:
   - Task: Add title, description, assignee, due date
   - Approval: Set role and approval count
   - Automated: Select action and fill parameters

4. **Run simulation** by clicking the green "Run Workflow" button

5. **View results** in the execution panel on the right

## 📁 Project Files

### Core Application Files
```
src/
├── App.tsx              # Main application component
├── main.tsx             # Entry point
├── types/index.ts       # All TypeScript definitions
├── store/workflowStore.ts  # Global state (Zustand)
├── services/workflowAPIService.ts  # Mock API
├── hooks/               # Custom hooks (3 files)
├── components/          # UI components (5 files)
├── nodes/               # React Flow nodes
└── forms/               # Configuration forms
```

### Configuration Files
```
vite.config.ts          # Vite configuration
tsconfig.json           # TypeScript configuration
package.json            # Dependencies
eslint.config.js        # ESLint configuration
```

### Documentation
```
README.md               # User guide
DEVELOPMENT.md          # Developer guide
API.md                  # API documentation
IMPLEMENTATION.md       # What was built
```

## 🎨 UI Layout

```
┌─────────────────────────────────────────────┐
│        HR Workflow Designer Header          │
├─────────┬──────────────────────────────────┤
│ Sidebar │                                  │  ← Right Panel
│  Node   │       Canvas (React Flow)        │  ├─ Configuration
│ Palette │                                  │  │  Panel OR
│         │    (Drag to place nodes)         │  ├─ Execution
│ ┌─────┐ │                                  │  │  Panel
│ │ ▶   │ │      [Node] ──→ [Node]          │  │
│ │Start│ │        ↓         ↓              │  └─ Toggle
│ └─────┘ │      [Node]   [Node]            │    Button
│         │                                  │
│ Toolbar │                                  │
│ ├─ Run  │                                  │
│ ├─ Export                                  │
│ └─ Clear                                  │
└─────────┴──────────────────────────────────┘
```

## 📚 Documentation Files Included

1. **README.md** - Complete user guide with features and setup
2. **DEVELOPMENT.md** - Developer guide with architecture and patterns
3. **API.md** - API documentation with all methods and examples
4. **IMPLEMENTATION.md** - What was built and design decisions

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Dependencies
npm install              # Install all dependencies
npm update               # Update dependencies
```

## 🎯 Workflow Types Available

### Node Types (5)
- **Start** - Workflow beginning
- **Task** - Manual work with assignee
- **Approval** - Role-based approval
- **Automated** - Automation actions
- **End** - Workflow completion

### Automation Actions (4)
- **Send Email** - Email notifications
- **Create Task** - Task creation
- **Database Query** - Execute queries
- **Webhook Call** - External integrations

## ✅ What's Implemented

- ✓ Drag-and-drop canvas (React Flow)
- ✓ 5 node types with configuration
- ✓ Dynamic forms for each node
- ✓ Workflow simulation
- ✓ Execution logs
- ✓ Export to JSON
- ✓ Download workflows
- ✓ State management (Zustand)
- ✓ Full TypeScript support
- ✓ Responsive UI design
- ✓ Mock API service
- ✓ Input validation
- ✓ Error handling

## 🚀 Next Steps

### For Users
1. Create workflows visually
2. Run simulations to test
3. Export and save workflows
4. Download for sharing

### For Developers
1. Study the [DEVELOPMENT.md](DEVELOPMENT.md) guide
2. Review [API.md](API.md) for services
3. Check types in `src/types/index.ts`
4. Explore component structure in `src/components/`

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Try a different port
PORT=5175 npm run dev
```

### Build errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors
```bash
# Check types
npm run build
```

## 📦 Project Stats

- **Language**: TypeScript
- **Framework**: React 19
- **Build Tool**: Vite
- **Package Manager**: npm
- **Bundle Size**: ~350KB (109KB gzipped)
- **Lines of Code**: ~1,500

## 💡 Key Technologies

- **React Flow** - Workflow visualization
- **Zustand** - State management
- **TypeScript** - Type safety
- **Vite** - Fast development
- **ESLint** - Code quality

## 🎓 Learning Resources

Included in the project:
- Type definitions (src/types/index.ts)
- Custom hooks (src/hooks/)
- Service layer (src/services/)
- Component examples (src/components/)

External resources:
- [React Flow Docs](https://reactflow.dev/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## 📞 Need Help?

Check the documentation:
1. **README.md** - General usage
2. **DEVELOPMENT.md** - Technical details
3. **API.md** - API reference
4. **Code comments** - Inline explanations

## 🎉 Ready to Go!

Your HR Workflow Designer is fully functional and ready to use. Start with the dev server and explore!

```bash
npm run dev
```

Happy workflow designing! 🚀
