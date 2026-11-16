# Changelog

## Unreleased

A visual refresh of the core components, so controls, surfaces and the dark theme read as one system. No prop was removed, but several defaults and a few visuals change, so check the notes below before upgrading.

### Added

- **Flex**, **Stack**, **Group**, **Center** and **SimpleGrid** to arrange children in a row, a column or a grid, with a `gap` in `rem`.
- **Overlay** and **LoadingOverlay** to dim or block an area, with a spinner while it loads.
- **List** with `List.Item`, bulleted, numbered or with an icon as the marker.
- **ColorSwatch**, a circle or square that shows a color.
- **Radio.Card** and **Checkbox.Card**, options in a card where the whole area is the click target.
- **AppShell** with `Header`, `Navbar`, `Main`, `Aside` and `Footer`, a frame for the page of an app.
- **useSessionStorage**, the same as `useLocalStorage` for the data of one tab.

### Changed

- **Rating** was rebuilt. The default `variant` is now `filled`, `precision` accepts `0.25`, `onChange` only fires when the value changes, and the root has the `slider` role (`img` when `readOnly` or `disabled`). New props: `showValue` and `name`. `icon` and `emptyIcon` also accept a function of the index. Pressing an icon shrinks it and picking one plays a short drip, both off with `prefers-reduced-motion`.
- **Primary color** is now the accent of Checkbox, Radio, Toggle, Spinner and Slider. Toggle used the success color by default, and Spinner used the foreground color.
- **Checkbox** no longer renders `CheckboxIcon`. The box and the check mark are plain elements styled with CSS variables, and the off state border follows `accents_4`.
- **Dark theme** lightens `accents_2`, `border` and the muted text steps, so controls sit one step above the card.
- **Input, Select and SegmentedControl** share the Button height. **Tag** follows the radius token and **Card** is one step rounder.
- **Charts** color the series with primary, then secondary.
- **Date names** in Calendar, MiniCalendar and Schedule only capitalize the first letter. Button and label text keep sentence case.
- **CssBaseline** sets `font-family: inherit` on the base elements, so the font set on the page applies everywhere.

### Fixed

- **Slider** keeps the pointer position when you click the track, no longer flickers the cursor while dragging, has a taller area to grab and no longer sits above sticky headers.
- **ColorPicker** hue bar and **Splitter** handle have a wider area to grab.
- **Calendar** fills the width of its parent.
- **Timeline**, **SegmentedControl** and **Avatar** are tuned for the dark theme.
