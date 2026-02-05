# Mission Control Implementation Plan

## Overview
Modernize the Mission Control dashboard with a single-page layout, improved UX, and modern visual design.

## Files to Modify

### 1. `/src/app/page.tsx` - Main Dashboard
**Changes:**
- Replace tabbed interface with single-page dashboard layout
- Add stats overview section at top
- Three-column layout: Agents (left), Tasks (center), Activity (right)
- Responsive: Stack on mobile, sidebars collapse

### 2. `/src/components/AgentCard.tsx` - Redesign
**Changes:**
- Compact horizontal layout
- Status ring around avatar
- Remove session key (too technical)
- Add current task indicator

### 3. `/src/components/TaskBoard.tsx` - Refactor
**Changes:**
- Reduce to 4 columns (Todo, In Progress, Review, Done)
- Blocked status shown as badge on Todo
- Improved task card design
- Better scroll handling

### 4. New Components to Create

#### `/src/components/StatsCard.tsx`
- Overview stats (Active Agents, Open Tasks, In Progress, Blocked)
- Icon + number + trend/indicator
- Click to filter (future)

#### `/src/components/QuickActions.tsx`
- Create Task button
- Message Squad button
- View toggle

### 5. `/src/app/globals.css` - Theme Enhancements
**Changes:**
- Add gradient utilities
- Enhanced shadow utilities
- Animation keyframes
- Custom scrollbar styling

### 6. `/src/components/ui/` - New shadcn Components
Need to add:
- `tooltip.tsx` - For hover info
- `progress.tsx` - For task completion stats
- `skeleton.tsx` - For loading states

## Implementation Steps

### Phase 1: Core Layout
1. Redesign `page.tsx` with new layout
2. Create `StatsCard` component
3. Update grid system

### Phase 2: Component Updates
4. Redesign `AgentCard` - compact version
5. Refactor `TaskBoard` - 4 columns
6. Update `ActivityFeed` - sidebar style

### Phase 3: Polish
7. Update `globals.css` with new utilities
8. Add loading states
9. Empty state improvements
10. Responsive refinements

## New Dependencies
None required - using existing shadcn/ui + Tailwind

## Color Scheme (CSS Variables)
```css
/* Status Gradients */
--status-active: linear-gradient(135deg, #10b981, #059669);
--status-idle: linear-gradient(135deg, #f59e0b, #d97706);
--status-blocked: linear-gradient(135deg, #f43f5e, #e11d48);

/* Task Status */
--task-todo: #64748b;
--task-progress: #3b82f6;
--task-review: #8b5cf6;
--task-done: #10b981;
```

## Responsive Breakpoints
- Mobile (< 768px): Single column, collapsible sidebars
- Tablet (768px - 1024px): Two column (tasks main, agents below)
- Desktop (> 1024px): Three column layout

## Data Flow
- Keep existing Convex queries
- Pass data down as props
- No state management changes needed

## Testing Checklist
- [ ] All agents display correctly
- [ ] Tasks show in proper columns
- [ ] Activity feed scrolls
- [ ] Responsive layout works
- [ ] Dark mode looks good
- [ ] Loading states appear
- [ ] Empty states render
