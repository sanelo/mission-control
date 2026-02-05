# Mission Control Dashboard — UX Analysis Report
**Analyst:** Shuri (Product Analyst / Edge Case Hunter)  
**Date:** 2026-02-05  
**Dashboard:** http://localhost:3000

---

## Executive Summary

The Mission Control dashboard has undergone significant modernization since the initial UX audit. The current implementation successfully addresses many of the original pain points:

✅ **What's Working Well:**
- Single-page layout with all key info visible (no tabs hiding content)
- Stats overview cards prominently displayed
- 3-column task board (Todo, In Progress, Done) — reduced from 6 columns
- Grouped activity feed (Today, Yesterday, Earlier)
- Modern styling with gradients and glassmorphism effects
- Responsive 3-column layout (Agents | Tasks | Activity)

⚠️ **Remaining Issues to Address:**
- Task visibility on main page needs enhancement
- Missing quick-action workflows
- Limited task filtering/sorting capabilities
- No task detail view/modal
- Agent workload visibility is absent

---

## 1. Current UI Pain Points

### 1.1 Task Card Information Density
**Problem:** Task cards show limited information at a glance.

**Current State:**
- Title (truncated at 2 lines)
- Priority badge
- Status badge
- Assignee avatars

**Missing:**
- Due dates (critical for urgency)
- Tags/labels for categorization
- Estimated effort/time
- Comment count (indicates discussion level)
- Last updated timestamp

**Evidence:** Looking at the `TaskBoard.tsx`, cards only show:
```tsx
<h4 className="text-sm font-medium text-slate-200 mb-2 line-clamp-2">
  {task.title}
</h4>
```

**Recommendation:** Add a compact metadata row below the title showing due date, tags, and comment count.

---

### 1.2 No Task Detail View
**Problem:** Users cannot click into a task to see full details, description, comments, or history.

**Current State:** Cards have `cursor-pointer` but no click handler:
```tsx
<Card className="... cursor-pointer group">
```

**Impact:** Users must rely on truncated descriptions and cannot see:
- Full task description
- Associated comments/updates
- Activity history for the task
- Related tasks or dependencies

**Recommendation:** Implement a task detail modal/sheet that opens on card click.

---

### 1.3 Blocked Tasks Are Hidden
**Problem:** Blocked status is only shown as a small icon, not as a dedicated column.

**Current State:** Blocked tasks appear in the "To Do" column with a red alert icon:
```tsx
{task.status === 'blocked' && (
  <AlertCircle className="h-4 w-4 text-red-400" />
)}
```

**Impact:** Blocked items don't get the visual prominence they need. They're easy to miss among other todo items.

**Recommendation:** Either:
- Add a 4th column for "Blocked" (preferred)
- Or add a prominent filter/badge showing blocked task count

---

### 1.4 Agent Workload Is Invisible
**Problem:** You can't see how many tasks each agent has or their current capacity.

**Current State:** Agent cards only show status (active/idle/blocked) and role:
```tsx
<h3 className="font-semibold text-sm truncate">{agent.name}</h3>
<p className="text-xs text-muted-foreground truncate">{agent.role}</p>
```

**Impact:** Cannot identify:
- Overloaded agents
- Available capacity for new assignments
- Work distribution imbalances

**Recommendation:** Add a compact workload indicator (e.g., "3 tasks · 2 in progress") to each agent card.

---

### 1.5 No Task Filtering or Search
**Problem:** With many tasks, finding specific items becomes difficult.

**Current State:** No search, filter, or sort capabilities in the task board.

**Missing:**
- Search by task title/description
- Filter by assignee
- Filter by priority
- Filter by tag/label
- Sort by due date, priority, or created date

**Recommendation:** Add a filter bar above the task board with search input and filter dropdowns.

---

## 2. Modern Dashboard Patterns to Adopt

### 2.1 Command Palette (Quick Navigation)
**Pattern:** `Cmd+K` (or `Ctrl+K`) to open a searchable command palette.

**Use Cases:**
- Jump to any task by typing its name
- Change agent status
- Create new task
- Navigate between views

**Implementation:** Use shadcn/ui Command component.

---

### 2.2 Inline Task Creation
**Pattern:** "Add task" input at the bottom of each column.

**Current State:** Must use QuickActions button (location unclear in current flow).

**Benefit:** Reduces friction for adding tasks — just click and type.

**Implementation:** Add a compact input field at the bottom of each task column that expands on focus.

---

### 2.3 Drag-and-Drop Task Management
**Pattern:** Drag tasks between columns to change status.

**Current State:** Status changes require editing the task (presumably through API).

**Benefit:** Natural Kanban interaction that users expect.

**Implementation:** Use `@dnd-kit/core` or `react-beautiful-dnd`.

---

### 2.4 Toast Notifications for Real-Time Updates
**Pattern:** Show toast when new activity occurs or tasks are updated.

**Current State:** Activity feed updates silently.

**Benefit:** Keeps users informed of changes without requiring them to watch the feed.

---

### 2.5 Empty State Illustrations
**Pattern:** Visual empty states instead of text-only.

**Current State:**
```tsx
<div className="text-center py-8 text-slate-600">
  <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
  <p className="text-sm">No tasks</p>
</div>
```

**Improvement:** Add friendly illustrations and CTA buttons in empty states.

---

## 3. Task Visibility Improvements (Move to Main Page)

### 3.1 Priority-Based Task Highlighting
**Current:** Priority badges use color-coded backgrounds:
```tsx
const PRIORITY_COLORS = {
  low: 'bg-slate-700 text-slate-300',
  medium: 'bg-blue-900/50 text-blue-300',
  high: 'bg-amber-900/50 text-amber-300',
  urgent: 'bg-red-900/50 text-red-300',
};
```

**Issue:** Urgent tasks don't visually "pop" enough.

**Recommendation:** 
- Add left-border color accent to urgent/high priority cards
- Consider a "Priority Tasks" section at the top of the task board

---

### 3.2 My Tasks Filter (Default View)
**Pattern:** Show a "My Tasks" toggle or tab that filters to tasks assigned to the current user.

**Benefit:** For individual agents viewing the dashboard, they want to see their work first.

---

### 3.3 Overdue Task Indicator
**Current:** No due dates shown on task cards.

**Recommendation:** Add due date display with color coding:
- Green: Due today or future
- Amber: Due within 24 hours
- Red: Overdue

---

### 3.4 Task Progress Indicators
**Pattern:** For tasks with subtasks or checklists, show a progress bar.

**Current:** No subtask support visible in the data model.

**Recommendation:** If adding subtasks later, include a mini progress indicator on the card.

---

## 4. UX Workflow Improvements

### 4.1 Quick Actions Need Context
**Current:** `QuickActions` component is in the header but its contents are unknown.

**Recommendation:** Quick actions should include:
- ➕ New Task (opens modal with pre-filled assignee if from agent card)
- ✉️ Message Squad (opens team chat/announcement)
- 📊 View Reports (switches to analytics view)
- 🔔 Notifications (shows recent mentions/updates)

---

### 4.2 Agent Selection for Task Assignment
**Current:** Assignee avatars show on task cards, but assignment flow is unclear.

**Recommendation:** 
- Clicking an agent card should filter tasks to show only their assignments
- Task detail view should have a dropdown for reassigning

---

### 4.3 Activity Feed Enhancements
**Current:** Activity feed is well-implemented with grouping.

**Improvements:**
- Add filtering (show only tasks, only messages, etc.)
- Make activity items clickable (jump to related task)
- Add "Mark all as read" functionality
- Show unread badge count in the Activity header

---

### 4.4 Keyboard Shortcuts
**Pattern:** Power users expect keyboard navigation.

**Recommended Shortcuts:**
- `?` — Show shortcuts help
- `Cmd+K` — Command palette
- `N` — New task
- `F` — Focus search/filter
- `1/2/3` — Switch between main sections (Agents/Tasks/Activity)

---

## 5. Specific Implementation Recommendations for Friday

### High Priority (Implement First)

1. **Task Detail Modal**
   - Create `TaskDetailModal.tsx` component
   - Trigger on task card click
   - Show full description, comments, activity history
   - Include edit capabilities

2. **Task Metadata Enhancement**
   - Update `TaskBoard.tsx` card component
   - Add due date display
   - Add tag/label display
   - Show comment count

3. **Blocked Tasks Column**
   - Add 4th column in `COLUMNS` array
   - Update filtering logic
   - Apply red styling to entire column header

### Medium Priority

4. **Filter Bar Component**
   - Create `FilterBar.tsx`
   - Include: Search input, Assignee dropdown, Priority dropdown
   - Apply filters to task list

5. **Agent Workload Indicator**
   - Update `AgentCard.tsx` compact view
   - Calculate task count per agent
   - Show "X tasks · Y in progress"

6. **Inline Task Creation**
   - Add input field at bottom of each column
   - Quick-add with Enter key
   - Auto-assign to column's status

### Lower Priority / Polish

7. **Command Palette**
   - Install `cmdk` or use shadcn Command
   - Index all tasks and agents
   - Add quick actions

8. **Drag-and-Drop**
   - Install `@dnd-kit/core`
   - Implement between columns
   - Update task status on drop

9. **Keyboard Shortcuts**
   - Create `useKeyboardShortcuts` hook
   - Bind keys to actions
   - Add help modal

---

## 6. Visual Design Refinements

### 6.1 Consistent Spacing Scale
Audit the entire page for spacing consistency. Current observations:
- Header padding: `py-5`
- Section gaps: `gap-6`
- Card padding: `p-4`

Recommendation: Document and enforce a spacing scale (4px base: 4, 8, 12, 16, 24, 32).

### 6.2 Typography Hierarchy
Current headings:
- Page title: `text-2xl font-bold`
- Section headers: `text-lg font-semibold`

Recommendation: Add an intermediate size for task titles and ensure consistent font weights.

### 6.3 Color Usage for Status
Current status colors are good but could be more prominent:
- Consider adding subtle background tints to entire task cards based on priority
- Ensure blocked tasks are visually distinct

---

## 7. Competitive Analysis

### Linear (linear.app)
- **What they do well:** Keyboard-first navigation, command palette, clean minimalist design
- **What to borrow:** Their task card density and filtering approach

### GitHub Projects
- **What they do well:** Integration with code, customizable fields
- **What to borrow:** Tabular/list view toggle in addition to board view

### Trello
- **What they do well:** Simple drag-and-drop, card covers/attachments
- **What to borrow:** Card cover images for visual variety

### Asana
- **What they do well:** Timeline view, workload view
- **What to borrow:** Workload indicator per assignee

---

## Summary for Friday

### Must-Have (Before Launch)
1. ✅ Task board is visible on main page (DONE)
2. ⚠️ Task detail modal (NEEDED)
3. ⚠️ Due dates on task cards (NEEDED)
4. ⚠️ Blocked tasks visibility (NEEDED)

### Should-Have (Post-Launch)
5. Filter/search functionality
6. Agent workload indicators
7. Inline task creation
8. Activity feed filters

### Nice-to-Have (Future)
9. Command palette
10. Drag-and-drop
11. Keyboard shortcuts
12. Multiple view modes (board/list/timeline)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/TaskBoard.tsx` | Add due dates, tags, comment count to cards; add blocked column |
| `src/components/AgentCard.tsx` | Add workload indicator |
| `src/components/ActivityFeed.tsx` | Add filters, click handlers |
| `src/app/page.tsx` | Add filter bar component |
| `src/components/TaskDetailModal.tsx` | NEW: Task detail view |
| `src/components/FilterBar.tsx` | NEW: Search and filter UI |

---

*Report compiled by Shuri | Questions? Ping me in the squad channel.*
