# Prototype - Icon Management

---

## Proposed Structure

```sh
modules/
  @org/
    org-icons/
      manifest.json
      fetcher.js
    org-react-icons/
server/
  public/
    icons/
      ‎v1.0.0/
        ... all icons
      ‎v1.0.1/
        ... a new icon
      ‎v1.1.0/
        ... an updated icon
      
```

---

## Modules

- `modules` Represents published node modules.
- The `@org` folder is what you'd publish the node modules under.
  - `org-icons` Works under the assumption that consumers will only be using the
    icons specified in the manifest.
    - `manifest.json` Source of truth for what icons to use.
      ```json
      {
        "circle-icon": "http://localhost/s3/v1.0.0/circle-icon.svg",
        ‎‎"square-icon": "http://localhost/s3/v1.0.1/square-icon.svg",
        ‎‎"triangle-icon": "http://localhost/s3/v1.1.0/triangle-icon.svg"
      }
      ```
    - `fetcher.js` Reads manifest and downloads all icons.
      - Maybe allow for an override mechanism where you can pass in the icon
        name and an alternative URL to pull the asset from.
  - `org-react-icons` Componentizes `org-icons` for easy consumption within a
    React application.

---

## Server

Represents something like S3, just need something to serve assets and
demonstrate structure. Icons will be dumped in version folders.

Icons will be versioned via folders.
- **Major** release would contain all icons, and should only be created if the
  style of the icons has changed.
- **Minor** release would contain updates to existing icons, but only updated
  icons. Older icons can still be pulled in from the Major release folder.
- **Patch** release would contain new icons that fit with the current theme.

---

## Development

```sh
# Install all deps
npm i

# Start dev server
npm run start:dev
```

### Test URLs

- http://localhost:9000/icons/v1.0.0
- http://localhost:9000/icons/v1.0.1
- http://localhost:9000/icons/v1.1.0

---
