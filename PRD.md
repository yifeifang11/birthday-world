Below is the final consolidated PRD. Paste this into a `PRD.md` file in your project and give it to GitHub Copilot Agent.

````md
# PRD: Floating Avatar Message World

## 1. Product Summary

Build a small web app where friends can create simple low-poly floating avatars, leave a message, and have those avatars appear scattered around a 3D world. The recipient can enter the world, move around, approach each avatar, and read the message left by that person.

In addition to friend-submitted avatars, the world should include curated “memory sites” created by the app owner. These sites can display voice notes, Polaroid-style pictures, videos, or written notes recorded/created for the recipient.

The visual style should be simple, playful, bright, and inspired by basic Wii/Mii-like avatars, but not a direct copy. Characters should be abstract, low-poly, and customizable.

The project is built with an existing Next.js app.

---

## 2. Core Concept

Visitors do not need accounts.

A visitor:
1. Opens the site.
2. Enters their name.
3. Customizes a simple floating avatar.
4. Writes a short message.
5. Submits it.

The recipient:
1. Opens the world page.
2. Controls a floating player avatar.
3. Moves around a simple 3D environment.
4. Finds scattered friend avatars.
5. Approaches avatars to read their messages.
6. Finds special memory sites.
7. Interacts with memory sites to see photos, videos, notes, or voice recordings.

Each friend avatar should consist of:
- Floating head
- Floating torso
- No legs
- No walking animation
- Simple hover/bob animation
- Optional accessories

The project should feel like a lightweight 3D guestbook/memory world.

---

## 3. Recommended Tech Stack

Use the existing Next.js project.

Preferred stack:
- Next.js App Router
- React
- Three.js
- React Three Fiber, if easier for React integration
- Supabase for database
- Vercel for hosting

No authentication is required for regular visitors.

Admin functionality should use a simple environment-variable admin password or secret.

---

## 4. Non-Goals

Do not implement:
- Full user authentication
- Ready Player Me integration
- Mixamo animation
- Realistic avatars
- Legged walking characters
- Multiplayer real-time sync
- Chat system
- Complex physics
- User-uploaded 3D models
- User-uploaded images
- Public profile pages

This is a lightweight 3D message world, not a full social platform.

---

## 5. Main Object Types

There are two main interactable object types in the world:

### 5.1 Friend Avatars

Friend avatars are created by visitors.

Each friend avatar has:
- Display name
- Written message
- Avatar customization data
- World position
- Approval status

Interaction:
- Player approaches avatar.
- Prompt appears: `Press E to read message`
- Message popup opens.

### 5.2 Memory Sites

Memory sites are curated by the app owner.

A memory site can be one of these types:
- Voice note
- Polaroid-style photo
- Video
- Written note

Interaction:
- Player approaches site.
- Prompt appears based on type:
  - `Press E to play voice note`
  - `Press E to view photo`
  - `Press E to watch video`
  - `Press E to read note`
- Media modal opens.

For V1, memory sites should be static in code, stored in `lib/memorySites.ts`.

---

## 6. User Flows

### 6.1 Visitor Message Flow

Route: `/create`

The visitor should be able to:
1. Enter their display name.
2. Customize avatar appearance.
3. Write a message.
4. Preview the avatar live.
5. Submit the avatar and message.
6. See a success screen after submission.

The submitted message should not appear in the world until approved, unless moderation is disabled through config.

### 6.2 Recipient World Flow

Route: `/world`

The recipient should be able to:
1. Load the 3D world.
2. Control a floating player avatar using keyboard movement.
3. See all approved submitted avatars scattered around the world.
4. See special memory sites placed around the world.
5. Move near an avatar or memory site.
6. See an interaction prompt.
7. Press `E` or click/tap to open the correct popup/modal.
8. Close the popup/modal and continue exploring.

### 6.3 Admin Flow

Route: `/admin`

Admin should be able to:
1. Enter a simple admin password or secret.
2. View submitted messages.
3. Approve messages.
4. Delete inappropriate or unwanted messages.
5. See whether a message is approved.

Memory sites do not need a full admin editor in V1.

---

## 7. Pages and Routes

### `/`

Landing page.

Content:
- Short explanation of the project.
- Button/link to `/create`.
- Optional button/link to `/world`.

### `/create`

Avatar creator and message form.

Features:
- Name input
- Message textarea
- Avatar customization controls
- Live avatar preview
- Submit button
- Success state after submission

### `/world`

3D world page.

Features:
- Full-screen 3D canvas
- Player floating avatar
- Submitted friend avatars
- Static memory sites
- Movement controls
- Interaction prompt
- Message popup
- Memory site modal

### `/admin`

Admin review page.

Features:
- Admin secret/password input
- List of submitted messages
- Approve button
- Delete button
- Approved/unapproved status

---

## 8. API Routes

Use API routes to avoid exposing direct database write logic in the browser.

Suggested routes:

```txt
POST /api/messages
GET /api/messages

GET /api/admin/messages
POST /api/admin/messages/[id]/approve
DELETE /api/admin/messages/[id]

GET /api/memory-sites
````

Optional future routes:

```txt
GET /api/admin/memory-sites
POST /api/admin/memory-sites
PATCH /api/admin/memory-sites/[id]
DELETE /api/admin/memory-sites/[id]
```

For V1, memory sites should remain static in `lib/memorySites.ts`, so full memory site CRUD is not required.

---

## 9. Database Model

Use one primary database table for visitor-submitted messages.

### Supabase Table: `messages`

Columns:

```txt
id: uuid, primary key, default generated
display_name: text, required
name_slug: text, required
message: text, required
avatar: jsonb, required
position_x: float8, nullable
position_y: float8, nullable
position_z: float8, nullable
approved: boolean, default false
created_at: timestamptz, default now()
```

### Example `messages` Row

```json
{
  "id": "uuid-here",
  "display_name": "Maya",
  "name_slug": "maya",
  "message": "Happy birthday. This is such a cool idea.",
  "avatar": {
    "skinColor": "#d9a066",
    "hairColor": "#3a2418",
    "shirtColor": "#4a90e2",
    "headShape": "round",
    "torsoShape": "box",
    "hairStyle": "cap",
    "eyes": "dots",
    "mouth": "smile",
    "accessory": "none"
  },
  "position_x": 3,
  "position_y": 0,
  "position_z": -5,
  "approved": false,
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

## 10. Memory Site Data Model

For V1, memory sites should be static in code.

Create:

```txt
lib/memorySites.ts
```

### TypeScript Types

```ts
export type MemorySiteType = "voice" | "photo" | "video" | "note";

export type MemorySite = {
  id: string;
  title: string;
  description?: string | null;
  type: MemorySiteType;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  noteText?: string | null;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotationY?: number;
  enabled: boolean;
};
```

### Example `lib/memorySites.ts`

```ts
export const memorySites = [
  {
    id: "voice-note-1",
    title: "A voice note",
    description: "A short message from me.",
    type: "voice",
    mediaUrl: "/media/voice-note-1.mp3",
    thumbnailUrl: null,
    noteText: null,
    position: { x: -7, y: 0, z: 4 },
    rotationY: 0,
    enabled: true
  },
  {
    id: "photo-1",
    title: "Favorite photo",
    description: "One of my favorite memories.",
    type: "photo",
    mediaUrl: "/media/photo-1.jpg",
    thumbnailUrl: "/media/photo-1-thumb.jpg",
    noteText: "This was such a good day.",
    position: { x: 6, y: 0, z: -5 },
    rotationY: 0.5,
    enabled: true
  },
  {
    id: "video-1",
    title: "Video message",
    description: "A video I recorded.",
    type: "video",
    mediaUrl: "/media/video-message-1.mp4",
    thumbnailUrl: "/media/video-thumb-1.jpg",
    noteText: null,
    position: { x: 8, y: 0, z: 6 },
    rotationY: -0.3,
    enabled: true
  },
  {
    id: "note-1",
    title: "A note",
    description: "Something I wanted to say.",
    type: "note",
    mediaUrl: null,
    thumbnailUrl: null,
    noteText: "This is a written memory note.",
    position: { x: -5, y: 0, z: -8 },
    rotationY: 0,
    enabled: true
  }
];
```

---

## 11. Media Storage

For V1, store media files directly in `public/media`.

Example:

```txt
public/
  media/
    voice-note-1.mp3
    photo-1.jpg
    photo-1-thumb.jpg
    video-message-1.mp4
    video-thumb-1.jpg
```

Later, if larger media storage or uploading is needed, move media files to Supabase Storage.

Audio and video should not autoplay. Use native browser controls.

---

## 12. Avatar Customization

The avatar should be generated in code from simple shapes, not loaded from external 3D model files.

### Avatar Structure

Each avatar is a group containing:

```txt
Avatar Group
  Head
  Hair
  Eyes
  Mouth
  Torso
  Optional accessory
  Optional name label
```

The avatar should float above the ground. The head and torso should have a visible gap.

### Version 1 Avatar Type

```ts
export type AvatarConfig = {
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  headShape: "round" | "tall" | "wide";
  torsoShape: "box" | "oval" | "cone";
  hairStyle: "bald" | "cap" | "spiky" | "sidePart";
  eyes: "dots" | "oval" | "sleepy";
  mouth: "smile" | "flat" | "open";
  accessory: "none" | "glasses" | "hat" | "partyHat";
};
```

Use simple color presets instead of unrestricted color pickers if easier.

Suggested presets:

* Skin: 6 options
* Hair: 8 options
* Shirt: 10 options

---

## 13. 3D World Requirements

The world should be simple, lightweight, and bright.

Use:

* Flat ground plane
* Soft background color
* Ambient light
* Directional light
* Simple decorative objects such as trees, blocks, signs, paths, or platforms
* Scattered friend avatars
* Special memory sites

Do not use heavy textures or complex 3D assets for V1.

The world should feel like a small explorable memory plaza, island, park, or dreamlike space.

---

## 14. Scattered Avatar Placement

Friend-submitted avatars should be scattered around the map, not tightly grouped.

Use deterministic placement so avatars stay in the same place between reloads.

For V1:

* Assign the position at submit time on the server.
* Store the position in the database.
* Use a deterministic spiral scatter function.

Suggested function:

```ts
export function getScatterPosition(index: number) {
  const angle = index * 2.399963229728653; // golden angle
  const radius = 4 + Math.sqrt(index) * 2.2;

  return {
    x: Math.cos(angle) * radius,
    y: 0,
    z: Math.sin(angle) * radius
  };
}
```

The server can calculate the index based on the number of existing messages.

Minimum desired spacing:

* Avatar to avatar: approximately `2.5` world units
* Avatar to memory site: approximately `3` world units
* Player spawn to any object: approximately `4` world units

Approximate spacing is acceptable in V1.

---

## 15. Memory Site Rendering

Each memory site should have a visible 3D object in the world.

### Voice Note Site

Visual:

* Small pedestal or floating speaker-like object
* Optional pulsing ring
* Label above it

Interaction:

* Opens audio player modal.
* Use `<audio controls src={mediaUrl} />`.

### Photo Site

Visual:

* Polaroid-style upright frame
* White border
* Image or thumbnail inside the frame if available
* Label above it

Interaction:

* Opens larger Polaroid-style modal.
* Displays image and optional note text.

### Video Site

Visual:

* Small screen, sign, or theater-style marker
* Uses video thumbnail if available
* Label above it

Interaction:

* Opens video modal.
* Use `<video controls src={mediaUrl} />`.

### Note Site

Visual:

* Floating letter, envelope, sign, or small book
* Label above it

Interaction:

* Opens note modal with text.

---

## 16. Unified Interactable System

The world should use one interaction system for both friend avatars and memory sites.

Each interactable should have:

* `id`
* `kind`
* `position`
* `interactionRadius`
* `prompt`
* `payload`

Example:

```ts
type WorldInteractable =
  | {
      id: string;
      kind: "message";
      position: THREE.Vector3;
      interactionRadius: number;
      prompt: string;
      payload: Message;
    }
  | {
      id: string;
      kind: "memorySite";
      position: THREE.Vector3;
      interactionRadius: number;
      prompt: string;
      payload: MemorySite;
    };
```

The player should interact with the nearest object in range.

Suggested logic:

```ts
function findNearbyInteractable(player, interactables) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (const item of interactables) {
    const distance = player.position.distanceTo(item.position);

    if (distance < item.interactionRadius && distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }

  return nearest;
}
```

When interacting:

```ts
if (nearby.kind === "message") {
  openMessagePopup(nearby.payload);
}

if (nearby.kind === "memorySite") {
  openMemorySiteModal(nearby.payload);
}
```

---

## 17. Player Controls

The recipient controls a floating player avatar.

Controls:

* `W`: forward
* `A`: left
* `S`: backward
* `D`: right
* `E`: interact with nearby avatar or memory site
* `Esc`: close active popup/modal

Optional:

* Arrow keys as movement alternatives
* Mobile/touch controls later

Player movement should slide across the X/Z plane. No jump is needed.

Suggested movement logic:

```ts
function updatePlayerMovement(player, keys, delta) {
  const speed = 4;
  const direction = new THREE.Vector3();

  if (keys.w) direction.z -= 1;
  if (keys.s) direction.z += 1;
  if (keys.a) direction.x -= 1;
  if (keys.d) direction.x += 1;

  direction.normalize();

  player.position.x += direction.x * speed * delta;
  player.position.z += direction.z * speed * delta;

  if (direction.length() > 0) {
    player.rotation.y = Math.atan2(direction.x, direction.z);
  }
}
```

Camera should follow the player from behind and above.

Suggested camera behavior:

```ts
camera.position.x = player.position.x;
camera.position.y = player.position.y + 3;
camera.position.z = player.position.z + 5;
camera.lookAt(player.position.x, player.position.y + 1.2, player.position.z);
```

---

## 18. Hover Animation

All avatars should gently bob up and down.

Use an offset per avatar so they do not move identically.

Suggested logic:

```ts
avatar.position.y = baseY + Math.sin(time * 2 + offset) * 0.08;
```

Nearby friend avatars may optionally rotate to face the player.

Suggested logic:

```ts
function facePlayer(avatar, player) {
  const dx = player.position.x - avatar.position.x;
  const dz = player.position.z - avatar.position.z;
  avatar.rotation.y = Math.atan2(dx, dz);
}
```

---

## 19. Message Interaction

When the player is near a submitted avatar:

* Show prompt: `Press E to read message`
* Pressing `E` opens a popup

Message popup should show:

* Display name
* Message
* Close button

---

## 20. Memory Site Interaction

When the player is near a memory site:

* Show a prompt based on memory site type
* Pressing `E` opens the correct modal

Memory site modal should support:

For type `voice`:

* Title
* Description
* `<audio controls src={mediaUrl} />`

For type `photo`:

* Polaroid-style image
* Title
* Description
* Optional note text

For type `video`:

* Title
* Description
* `<video controls src={mediaUrl} />`

For type `note`:

* Title
* Description
* Note text

---

## 21. Form Validation

For `/create`, validate:

```txt
display_name:
  required
  max 32 characters

message:
  required
  max 500 characters

avatar:
  required
  must match allowed customization options
```

Server behavior:

* Trim user input.
* Reject empty names.
* Reject empty messages.
* Reject unexpected avatar fields.
* Reject invalid avatar option values.
* Generate `name_slug`.

---

## 22. Moderation

Even though the site is intended for friends, include moderation.

Default behavior:

* New messages are saved with `approved: false`
* Only `approved: true` messages appear in `/world`
* Admin can approve or delete messages

Optional environment setting:

```txt
AUTO_APPROVE_MESSAGES=true
```

If enabled, new messages appear immediately.

---

## 23. Security Requirements

No public user authentication is required.

However:

* Do not expose the Supabase service role key to the browser.
* Use server-side API routes for database writes.
* Validate all submitted data on the server.
* Do not allow public users to update, delete, or approve messages.
* Protect admin API routes with an admin secret or password.

Suggested environment variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
AUTO_APPROVE_MESSAGES=false
```

Admin API routes should require:

```txt
x-admin-secret: <secret>
```

---

## 24. Suggested File Structure

```txt
app/
  page.tsx
  create/
    page.tsx
  world/
    page.tsx
  admin/
    page.tsx
  api/
    messages/
      route.ts
    memory-sites/
      route.ts
    admin/
      messages/
        route.ts
        [id]/
          approve/
            route.ts
          route.ts

components/
  AvatarCreator.tsx
  AvatarPreview.tsx
  FloatingAvatar.tsx
  WorldScene.tsx
  PlayerController.tsx
  MessagePopup.tsx
  InteractionPrompt.tsx
  AdminMessageList.tsx
  MemorySiteObject.tsx
  MemorySiteModal.tsx
  PolaroidObject.tsx
  VoiceNoteObject.tsx
  VideoSiteObject.tsx
  NoteSiteObject.tsx

lib/
  supabaseServer.ts
  avatarOptions.ts
  validation.ts
  positions.ts
  scatterPositions.ts
  memorySites.ts
  interactables.ts
  types.ts

public/
  media/
    voice-note-1.mp3
    photo-1.jpg
    photo-1-thumb.jpg
    video-message-1.mp4
    video-thumb-1.jpg
```

---

## 25. Component Requirements

### `AvatarCreator`

Responsibilities:

* Holds avatar customization state.
* Holds display name and message state.
* Shows customization controls.
* Shows live avatar preview.
* Submits data to `/api/messages`.

### `AvatarPreview`

Responsibilities:

* Renders a small 3D preview of the current avatar.
* Reuses `FloatingAvatar`.

### `FloatingAvatar`

Responsibilities:

* Generates a simple avatar from `AvatarConfig`.
* Supports different head shapes, torso shapes, hair styles, eyes, mouths, and accessories.
* Supports hover animation.
* Optionally displays a name label.

### `WorldScene`

Responsibilities:

* Fetches approved messages.
* Loads static memory sites.
* Creates the 3D world.
* Places all friend avatars.
* Places all memory sites.
* Creates the player avatar.
* Handles interaction state.

### `PlayerController`

Responsibilities:

* Tracks key presses.
* Moves player avatar.
* Updates camera follow.

### `MessagePopup`

Responsibilities:

* Displays selected friend message.
* Includes close button.

### `InteractionPrompt`

Responsibilities:

* Shows the current nearest-object interaction prompt.
* Hides when no object is nearby.

### `MemorySiteObject`

Responsibilities:

* Receives a `MemorySite`.
* Chooses correct visual object based on `type`.
* Renders label.
* Provides position for interaction registration.

### `MemorySiteModal`

Responsibilities:

* Receives selected memory site.
* Renders the correct media UI.

### `PolaroidObject`

Responsibilities:

* Renders a simple upright Polaroid-style 3D object.
* Uses thumbnail texture if available.

### `VoiceNoteObject`

Responsibilities:

* Renders a simple voice-note marker or speaker-like object.

### `VideoSiteObject`

Responsibilities:

* Renders a small screen or video marker.

### `NoteSiteObject`

Responsibilities:

* Renders a simple note, letter, sign, or book marker.

### `AdminMessageList`

Responsibilities:

* Fetches all messages.
* Shows approval state.
* Allows approve/delete.

---

## 26. API Requirements

### `POST /api/messages`

Creates a new message.

Request body:

```json
{
  "displayName": "Maya",
  "message": "Happy birthday!",
  "avatar": {
    "skinColor": "#d9a066",
    "hairColor": "#3a2418",
    "shirtColor": "#4a90e2",
    "headShape": "round",
    "torsoShape": "box",
    "hairStyle": "cap",
    "eyes": "dots",
    "mouth": "smile",
    "accessory": "none"
  }
}
```

Server behavior:

* Validate fields.
* Generate `name_slug`.
* Calculate scattered world position.
* Set `approved` based on `AUTO_APPROVE_MESSAGES`.
* Insert into Supabase.
* Return success response.

### `GET /api/messages`

Returns only approved messages.

Response:

```json
[
  {
    "id": "uuid",
    "displayName": "Maya",
    "message": "Happy birthday!",
    "avatar": {},
    "position": {
      "x": 3,
      "y": 0,
      "z": -5
    }
  }
]
```

### `GET /api/memory-sites`

Returns enabled static memory sites.

Can read from `lib/memorySites.ts`.

### `GET /api/admin/messages`

Returns all messages.

Requires admin secret.

### `POST /api/admin/messages/[id]/approve`

Approves one message.

Requires admin secret.

### `DELETE /api/admin/messages/[id]`

Deletes one message.

Requires admin secret.

---

## 27. Visual Style

The app should feel:

* Simple
* Low-poly
* Friendly
* Clean
* Bright
* Lightweight
* Slightly toy-like
* Personal and warm without being visually cluttered

Avoid:

* Realistic faces
* Detailed textures
* Heavy post-processing
* Complex lighting
* Dark visual design
* Large 3D assets

The avatars should look abstract and charming rather than realistic.

---

## 28. Performance Requirements

Target:

* Fast initial page load
* Lightweight 3D scene
* No large 3D avatar model files
* Avatars generated from simple geometry
* Support at least 30 submitted avatars smoothly on a normal laptop

For V1:

* Limit world avatars to latest 50 approved messages if needed.
* Avoid loading external 3D assets.
* Avoid high-poly geometry.
* Use simple materials and simple lighting.

---

## 29. Accessibility and UX

The app should:

* Provide clear form labels.
* Have readable text.
* Show loading states.
* Show error states.
* Work on desktop first.
* Include visible controls on the `/world` page.

World controls overlay:

```txt
Move: W A S D
Interact: E
Close: Esc
```

Mobile support is optional for V1.

---

## 30. Implementation Phases

### Phase 1: Basic Floating Avatar

Build:

* `FloatingAvatar`
* Hardcoded avatar in a simple Three.js scene
* Hover animation

Acceptance criteria:

* A floating head and torso render correctly.
* Avatar uses simple shapes.
* Avatar bobs gently.

### Phase 2: Avatar Creator

Build:

* `/create`
* Name input
* Message textarea
* Avatar customization controls
* Live avatar preview

Acceptance criteria:

* User can change avatar options.
* Preview updates immediately.
* Form validates required fields.

### Phase 3: Database and Message API

Build:

* Supabase `messages` table.
* `POST /api/messages`
* `GET /api/messages`
* Server-side validation.
* Deterministic scattered position assignment.

Acceptance criteria:

* Submissions save to Supabase.
* Submitted avatars are assigned stable scattered positions.
* Position is stored in the database.
* Approved messages can be fetched.
* Invalid submissions are rejected.

### Phase 4: Basic 3D World

Build:

* `/world`
* Ground plane
* Lighting
* Player start area
* Fetch approved messages
* Render scattered friend avatars

Acceptance criteria:

* Friend avatars appear scattered around the map.
* No two initial avatars are stacked on top of each other.
* Player can visually identify separate characters.

### Phase 5: Player Movement and Camera

Build:

* Player floating avatar
* WASD movement
* Camera follow
* Controls overlay

Acceptance criteria:

* Recipient can move around the world.
* Camera follows smoothly.
* Player remains on the flat world plane.

### Phase 6: Friend Message Interaction

Build:

* Proximity detection
* Interaction prompt
* Message popup

Acceptance criteria:

* Approaching a friend avatar shows prompt.
* Pressing `E` opens the correct message.
* Popup can be closed with button or `Esc`.

### Phase 7: Static Memory Sites

Build:

* `lib/memorySites.ts`
* `MemorySiteObject`
* `MemorySiteModal`
* Photo, voice, video, and note site support
* Add several hardcoded memory sites to the world

Acceptance criteria:

* Memory sites render in the world.
* Memory sites use distinct visuals by type.
* Approaching a memory site shows the correct prompt.
* Pressing `E` opens the correct media modal.
* Audio/video use browser controls and do not autoplay.

### Phase 8: Unified Interactable System

Build:

* Shared interaction logic for friend avatars and memory sites.
* Nearest-object selection.
* One prompt system.
* One modal selection system.

Acceptance criteria:

* Player can interact with both avatars and memory sites.
* If multiple objects are nearby, the closest one is selected.

### Phase 9: Admin Moderation

Build:

* `/admin`
* Admin secret
* List submitted messages
* Approve messages
* Delete messages

Acceptance criteria:

* Unapproved messages do not show in world.
* Admin can approve messages.
* Admin can delete messages.

### Phase 10: Polish

Build:

* Name labels above avatars.
* Labels above memory sites.
* Simple decorative objects.
* Better map layout.
* Loading and error states.
* Empty world state.
* Optional background music toggle.

Acceptance criteria:

* App feels complete and understandable.
* Visual style is consistent.
* Recipient can comfortably explore and read messages.

---

## 31. Initial Build Priority

Start in this order:

1. Create `FloatingAvatar`.
2. Create `/create` avatar editor with local state only.
3. Create Supabase table and API routes.
4. Save submissions.
5. Add scattered position assignment.
6. Create `/world` and render saved avatars.
7. Add player movement.
8. Add friend message interaction.
9. Add static memory sites.
10. Add unified interactable system.
11. Add admin moderation.
12. Polish visuals.

Do not begin with complex world design. The main product is the avatar-message interaction plus curated memory site discovery.

---

## 32. Definition of Done for V1

V1 is complete when:

* Visitors can create a floating avatar.
* Visitors can write a message.
* Each submitted avatar is assigned a scattered position.
* Submission is saved to the database.
* Admin can approve or delete submissions.
* Approved avatars appear scattered around the 3D world.
* The recipient can move around the world.
* The recipient can approach an avatar and read its message.
* The world includes at least four memory sites:

  * One voice note site
  * One Polaroid photo site
  * One video site
  * One written note site
* The recipient can interact with memory sites.
* Memory site modals display the correct media.
* No visitor login is required.
* Avatars are generated from simple geometry.
* No external 3D avatar service is required.
* The app is usable on desktop.

````

Use this short instruction with Copilot Agent before the PRD:

```txt
Use this PRD to implement the app incrementally. Start with Phase 1 and Phase 2. Prefer simple, readable code over abstractions. Do not add user authentication. Use generated low-poly floating avatars made from Three.js geometry. Store visitor avatars/messages in Supabase. Keep memory sites static in lib/memorySites.ts for V1. Use one unified interactable system for both avatars and memory sites.
````
