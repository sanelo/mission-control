# Mission Control UX Audit

## Current State Analysis

### What's Working
- Clean component structure with shadcn/ui
- Proper TypeScript typing
- Good data integration with Convex
- Functional tabbed navigation

### Key Friction Points

#### 1. **Tabbed Interface Hides Critical Info**
- Tasks are hidden behind a tab - users must click to see work status
- No at-a-glance view of squad health or task distribution
- Activity feed is buried, reducing situational awareness

#### 2. **Limited Visual Hierarchy**
- Header is basic with minimal information
- No summary stats or dashboard overview
- Flat design lacks depth and visual interest
- Cards don't differentiate importance levels

#### 3. **Task Board UX Issues**
- Horizontal scroll on task columns is awkward
- 6 columns creates cognitive overload
- Task cards lack visual distinction between statuses
- No quick actions on task cards

#### 4. **Missing Modern UI Patterns**
- No glassmorphism or subtle depth effects
- Limited use of color for status indication
- No micro-interactions or hover states
- Empty states are plain text without visuals

#### 5. **Information Density**
- Agent cards show session keys (too technical for dashboard)
- Task descriptions truncated without expand option
- Activity feed timestamps lack relative formatting

## Recommended Improvements

### High Priority
1. **Dashboard Layout Redesign**
   - Single-page view with all key info visible
   - Stats cards at top (Active Agents, Open Tasks, Blocked Items)
   - Task board as main focus (left/center)
   - Agents and Activity as sidebars

2. **Task Board Enhancement**
   - Reduce to 4 columns: Todo, In Progress, Review, Done
   - Collapse Blocked into Todo with badge
   - Better task card design with priority indicators
   - Drag-drop ready layout (even if not implemented yet)

3. **Visual Polish**
   - Gradient header with squad branding
   - Glassmorphism cards with subtle shadows
   - Color-coded status badges with icons
   - Improved spacing and typography scale

### Medium Priority
4. **Agent Section**
   - Compact horizontal layout instead of grid
   - Status rings around avatars
   - Current task indicator
   - Quick action buttons

5. **Activity Feed**
   - Group by time (Today, Yesterday, Earlier)
   - Richer activity cards with context
   - Unread indicator for new items

### Nice to Have
6. **Quick Actions Bar**
   - Create task button
   - Message squad button
   - View toggle (compact/comfortable)

7. **Theme Enhancements**
   - Squad-themed accent colors
   - Dark mode refinements
   - Animated transitions

## Design Direction

### Layout (Single Page)
```
┌─────────────────────────────────────────────────────────────┐
│  Header with gradient + Stats Overview                      │
├──────────────┬──────────────────────────────┬───────────────┤
│              │                              │               │
│  AGENTS      │      TASK BOARD              │   ACTIVITY    │
│  (compact)   │      (main focus)            │   FEED        │
│              │                              │               │
└──────────────┴──────────────────────────────┴───────────────┘
```

### Color Palette Refinements
- Primary: Keep current but add gradient variants
- Status Colors:
  - Active: Emerald gradient
  - Idle: Amber gradient  
  - Blocked: Rose gradient
- Task Status:
  - Todo: Slate
  - In Progress: Blue
  - Review: Purple
  - Done: Green

### Typography
- Larger header with squad branding
- Better font weights for hierarchy
- Monospace for technical data (session keys, timestamps)
