# SwiftCart AI Chat - Testing & Demo Guide

## Quick Demo (5 minutes)

### Prerequisites
- Node.js 16+ installed
- Backend running on `http://localhost:4000`
- PostgreSQL running (or use Docker)

### Step-by-Step Demo

#### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Should see: `Server running on port 4000`

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens automatically at `http://localhost:5173`

#### 3. Test New Chat
- Click the blue "New Chat" button
- Verify sidebar shows "New conversation"
- Chat area shows welcome message with 4 FAQ buttons

#### 4. Test Message Sending
- Click on FAQ button: "How can I track my order?"
- Message appears in chat (blue bubble, right-aligned)
- Verify timestamp displays
- Verify loading indicator shows (typing dots)
- Message is sent to backend
- Response should appear (or error if backend not ready)

#### 5. Test Conversation History
- Type and send a message: "Hello, I need help with my order"
- Verify message in history shows: "Hello, I need help with my order"
- Click "New Chat" again
- Verify previous conversation in sidebar history
- Click on history item to load it
- Previous messages should reload
- Verify active item is highlighted

#### 6. Test localStorage Persistence
- Close the browser tab
- Reopen DevTools and check Application → Local Storage
- See `conversations` and `activeSessionId` entries
- Reload page
- Verify conversation history is restored
- Verify messages are loaded

#### 7. Test Mobile Responsive
- Press F12 (DevTools)
- Click device toggle (mobile icon)
- Select iPhone 12/iPad
- Sidebar should be horizontal at top
- Messages should be readable
- Input box should be accessible
- All buttons should be clickable

#### 8. Test Error Handling
- Stop backend server
- Try to send a message
- Verify error banner appears: "Failed to send message..."
- Restart backend
- Error should clear on next successful action

## Feature Checklist

### UI Features
- [ ] Sidebar visible on desktop
- [ ] Left sidebar with app logo "SwiftCart AI"
- [ ] Blue "New Chat" button functional
- [ ] Conversation history list scrollable
- [ ] Active item highlighted in blue
- [ ] Chat header shows "SwiftCart Support"
- [ ] Online status with green dot (animated)
- [ ] Messages area scrollable
- [ ] User messages blue, right-aligned
- [ ] AI messages gray, left-aligned
- [ ] Timestamps display correctly
- [ ] Empty state shows welcome icon
- [ ] FAQ buttons visible on empty state
- [ ] Input box at bottom
- [ ] Send button works
- [ ] Typing indicator animates
- [ ] Error banner appears and disappears

### Functionality Tests
- [ ] New Chat creates new conversation
- [ ] sessionId stored and persists
- [ ] Messages send to /api/chat/message
- [ ] Conversation loads from /api/conversations/:id/messages
- [ ] Auto-scroll to bottom on new message
- [ ] Optimistic message appears before response
- [ ] localStorage updates on each action
- [ ] localStorage persists across refresh

### Mobile Tests
- [ ] Sidebar becomes horizontal on mobile
- [ ] Messages readable on small screens
- [ ] Input box accessible on mobile
- [ ] Touch keyboard integration works
- [ ] No horizontal scroll needed
- [ ] Buttons easily tappable

### Performance Tests
- [ ] Page loads in under 3 seconds
- [ ] Smooth scrolling (60fps)
- [ ] No lag when typing
- [ ] Animations smooth
- [ ] No memory leaks (use DevTools)

## Browser Testing Matrix

| Browser | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Chrome  | ✅      | ✅     | ✅     |
| Firefox | ✅      | ✅     | ✅     |
| Safari  | ✅      | ✅     | ✅     |
| Edge    | ✅      | ✅     | ✅     |

## DevTools Inspection

### Network Tab
1. Open DevTools → Network tab
2. Send a message
3. Verify POST request to `/api/chat/message`
4. Verify response contains `sessionId`
5. Verify GET request to `/api/conversations/:id/messages`

### Console Tab
- Should have zero errors
- No warnings about deprecated APIs
- Check for API errors (4xx, 5xx responses)

### Local Storage
- Check `Applications` → `Local Storage`
- Verify `conversations` JSON is valid
- Verify `activeSessionId` is a string
- Clear and test regeneration

### Performance
- Open DevTools → Performance tab
- Record page load
- Check for long tasks (>50ms)
- Verify smooth animations
- Check memory usage (should not grow indefinitely)

## API Response Testing

### Test Create Conversation
```bash
curl -X POST http://localhost:4000/api/conversations
```
Should return: `{"id":"uuid"}`

### Test Send Message
```bash
curl -X POST http://localhost:4000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"uuid"}'
```
Should return: `{"sessionId":"uuid","message":{...}}`

### Test Get Messages
```bash
curl http://localhost:4000/api/conversations/uuid/messages
```
Should return: `{"sessionId":"uuid","messages":[...]}`

## Edge Cases to Test

1. **Empty Message**
   - Type nothing and press Enter
   - Should not send

2. **Very Long Message**
   - Type 2000+ characters
   - Should fail with error (API limit)

3. **Rapid Clicks**
   - Click send button multiple times
   - Should only send one message (state management)
   - Loading state prevents duplicate sends

4. **Network Timeout**
   - Stop backend mid-request
   - Should show error
   - User message should be removable from history

5. **Refresh During Send**
   - Send message then immediately refresh
   - localStorage should preserve state
   - No duplicate messages on reload

6. **Mobile Orientation**
   - Send messages in portrait
   - Rotate to landscape
   - Messages should reflow correctly
   - Input box should still be accessible

## Performance Benchmarks

### Load Time
- First contentful paint: < 1s
- Fully interactive: < 2s
- Total bundle: ~150KB (minified)

### Runtime Performance
- Message send-to-display: < 500ms
- Scrolling: 60fps (no jank)
- Typing: No lag
- Memory: < 50MB usage

### Accessibility
- Keyboard navigation works (Tab through elements)
- Color contrast meets WCAG AA
- Screen reader compatible (basics)

## Screenshot Points

1. **Empty State** - Welcome message with FAQ buttons
2. **Message Conversation** - User and AI messages
3. **Mobile View** - Responsive layout on phone
4. **History Sidebar** - Multiple conversations
5. **Error State** - Error banner visible
6. **Loading State** - Typing indicator animation

## Common Issues & Solutions

### Issue: API returns 404 for conversations
**Solution**: Verify backend is running on port 4000

### Issue: localStorage not persisting
**Solution**: Check browser allows localStorage (not in private mode)

### Issue: Messages not appearing
**Solution**: Check network tab for API errors, restart backend

### Issue: Styling looks broken
**Solution**: Clear browser cache (Ctrl+Shift+Delete), hard refresh (Ctrl+Shift+R)

### Issue: Mobile layout squished
**Solution**: Check device emulation is correct, clear CSS cache

## Sign-off Checklist

- [ ] All features implemented per requirements
- [ ] No console errors
- [ ] Responsive on mobile (< 768px)
- [ ] localStorage working correctly
- [ ] API integration successful
- [ ] Error handling in place
- [ ] Animations smooth (60fps)
- [ ] Build passes without warnings
- [ ] Code reviewed and clean
- [ ] Documentation complete

## Video Demo Script (Optional)

**Duration: 3 minutes**

1. **Intro** (10s)
   - Show app name and purpose
   - Brief overview of features

2. **Fresh Start** (30s)
   - Show empty chat with welcome message
   - Click a FAQ button
   - Show typing indicator

3. **Message Flow** (30s)
   - Type custom message
   - Send and show response
   - Highlight message bubbles and timestamps

4. **History** (30s)
   - Show conversation history in sidebar
   - Create multiple conversations
   - Load previous conversation

5. **Mobile** (30s)
   - Rotate to mobile view
   - Show responsive layout
   - Send message from mobile

6. **Persistence** (10s)
   - Refresh page
   - Show history is restored
   - Close DevTools

7. **Summary** (10s)
   - Highlight key features
   - Mention tech stack
   - Call to action (try it!)

---

**Ready for testing! Let me know if you find any issues.** 🚀
