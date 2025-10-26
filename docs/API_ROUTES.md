# API Routes Documentation

## Authentication Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/api/users/register` | `{ name, email, password }` | `{ success, token, user }` | Register new user |
| POST | `/api/users/login` | `{ email, password }` | `{ success, token, user }` | Login existing user |
| GET | `/api/users/data` | - | `{ success, user }` | Get current user data (requires auth) |
| PUT | `/api/users/profile` | `{ name, email, bio }` | `{ success, user }` | Update user profile |

## Resume Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/api/resumes/` | - | `{ success, resumes }` | Get user's resumes |
| GET | `/api/resumes/:id` | - | `{ success, resume }` | Get specific resume |
| POST | `/api/resumes/create` | `{ title, template, sections }` | `{ success, resume }` | Create new resume |
| PUT | `/api/resumes/:id` | `{ title, sections, styling }` | `{ success, resume }` | Update resume |
| DELETE | `/api/resumes/:id` | - | `{ success, message }` | Delete resume |
| POST | `/api/resumes/:id/duplicate` | - | `{ success, resume }` | Duplicate resume |
| POST | `/api/resumes/:id/export` | `{ format }` | `{ success, downloadUrl }` | Export resume (PDF/DOCX) |

## AI Enhancement Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/api/ai/enhance` | `{ content, type, industry }` | `{ success, enhanced, analysis }` | Enhance content with AI |
| POST | `/api/ai/analyze` | `{ resumeData }` | `{ success, score, suggestions }` | Analyze resume quality |
| POST | `/api/ai/ats-check` | `{ resumeData, jobDescription }` | `{ success, compatibility, keywords }` | Check ATS compatibility |
| POST | `/api/ai/suggestions` | `{ section, context }` | `{ success, suggestions }` | Get contextual suggestions |
| POST | `/api/ai/optimize` | `{ content, targetRole }` | `{ success, optimized, keywords }` | Optimize for specific role |

## Template Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/api/templates/` | - | `{ success, templates }` | Get all templates |
| GET | `/api/templates/:id` | - | `{ success, template }` | Get specific template |
| GET | `/api/templates/preview/:id` | - | `{ success, previewUrl }` | Get template preview |
| POST | `/api/templates/customize` | `{ templateId, colors, fonts }` | `{ success, customTemplate }` | Customize template |

## File Upload Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/api/upload/resume` | `FormData(file)` | `{ success, parsedData }` | Upload and parse resume file |
| POST | `/api/upload/photo` | `FormData(image)` | `{ success, imageUrl }` | Upload profile photo |
| POST | `/api/upload/portfolio` | `FormData(files)` | `{ success, portfolioUrls }` | Upload portfolio files |

## Analytics Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/api/analytics/track` | `{ event, data, userId }` | `{ success }` | Track user events |
| GET | `/api/analytics/dashboard` | - | `{ success, metrics }` | Get user analytics |
| GET | `/api/analytics/performance` | - | `{ success, performance }` | Get app performance metrics |

## GitHub Integration Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/api/github/connect` | `{ githubToken }` | `{ success, userData }` | Connect GitHub account |
| GET | `/api/github/stats/:username` | - | `{ success, stats }` | Get GitHub statistics |
| GET | `/api/github/repos/:username` | - | `{ success, repositories }` | Get user repositories |
| GET | `/api/github/contributions/:username` | - | `{ success, contributions }` | Get contribution graph data |

## Collaboration Routes

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/api/collaborate/share` | `{ resumeId, permissions }` | `{ success, shareLink }` | Share resume for collaboration |
| GET | `/api/collaborate/:shareId` | - | `{ success, resume, permissions }` | Access shared resume |
| POST | `/api/collaborate/:shareId/edit` | `{ changes, section }` | `{ success, updated }` | Edit shared resume |
| GET | `/api/collaborate/:shareId/history` | - | `{ success, changes }` | Get edit history |

## WebSocket Events

| Event | Data | Direction | Description |
|-------|------|-----------|-------------|
| `join-room` | `{ resumeId, userId }` | Client → Server | Join collaboration room |
| `leave-room` | `{ resumeId, userId }` | Client → Server | Leave collaboration room |
| `content-change` | `{ resumeId, changes, section }` | Client → Server | Real-time content updates |
| `cursor-move` | `{ resumeId, position, userId }` | Client → Server | Cursor position updates |
| `user-joined` | `{ userId, userName }` | Server → Client | Notify user joined |
| `user-left` | `{ userId }` | Server → Client | Notify user left |
| `content-updated` | `{ changes, userId }` | Server → Client | Broadcast content changes |

## Error Responses

All routes return consistent error format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

## Authentication

### Headers Required
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Token Format
```javascript
{
  "userId": "user_id",
  "email": "user_email",
  "iat": timestamp,
  "exp": timestamp
}
```

## Rate Limiting

| Route Pattern | Limit | Window |
|---------------|-------|--------|
| `/api/ai/*` | 10 requests | 1 minute |
| `/api/upload/*` | 5 requests | 1 minute |
| `/api/users/login` | 5 requests | 15 minutes |
| `/api/users/register` | 3 requests | 15 minutes |
| All other routes | 100 requests | 15 minutes |

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **429**: Too Many Requests
- **500**: Internal Server Error

## Environment Variables

```bash
# Required for AI routes
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Required for file uploads
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint

# Required for GitHub integration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

**Note**: All routes require proper CORS headers and support OPTIONS preflight requests for cross-origin access.