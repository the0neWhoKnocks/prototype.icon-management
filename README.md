# Prototype - Icon Management

A proposal for how to manage static assets.
- Allows a developer the choice of how to consume the assets.
- Allows for easy consumption via URL, inlining on the server, or components.
- Versioning of icons without having to duplicate the unchanged icons per version.
  - Build times for icon manifests are optimized to reuse what came before it
  and only account for new/updated items.

---

## Proposed Structure

```sh
modules/
└─ @org/
   ├─ org-icons/
   └─ org-react-icons/

server/
└─ icons/
   ├─ v1.0.0/
   │  ├─ ... icons
   │  ├─ index.html
   │  └─ manifest.json
   ├─ v1.0.1/
   │  ├─ ... icons
   │  ├─ index.html
   │  └─ manifest.json
   ├─ v1.1.0/
   │  ├─ ... icons
   │  ├─ index.html
   │  └─ manifest.json
   ├─ index.html
   └─ manifest.json
```

### Modules

- `modules` Represents published node modules.
- The `@org` folder is what you'd publish the node modules under.
  - `org-icons` Works under the assumption that consumers will only be using the
    icons specified in the manifest.
    - Provides a Server interface to download and inline icons needed for the App.
    - Provides a base URL that can be used on the Client to get a specific 
  - `org-react-icons` Componentizes `org-icons` for easy consumption within a
    React application.

### Server

Represents an external server that will serve the icons, manifests, and static
pages that display all icons. For this example, the "static pages" are
dynamically generated on the fly, but could easily be published as well.

Icons will be versioned via folders.
- **Major** release would contain all icons, and should only be created if the
  style of the icons has changed.
- **Minor** release would contain updates to existing icons, but only updated
  icons. Older icons can still be pulled in from the Major release folder.
- **Patch** release would contain new icons that fit with the current theme.

- `manifest.json` Source of truth for what icons to use for each version.
  ```json
  {
    "_version": "v1.1.0",
    "circle-icon": "http://localhost/s3/v1.0.0/circle-icon.svg",
    ‎‎"square-icon": "http://localhost/s3/v1.0.1/square-icon.svg",
    ‎‎"triangle-icon": "http://localhost/s3/v1.1.0/triangle-icon.svg"
  }
  ```

---

## View Example

```sh
# Install all deps
npm i

# Start server
npm run start
```

---

## Development

```sh
# Install all deps
npm i

# Start dev server in watch mode
npm run start:dev
```
