# DMC Equipment Checkout

A web app for the Rice Digital Media Center to track equipment checkouts and returns. Students fill out a checkout form at a kiosk, and DMC staff manage the forms and check gear back in from an admin dashboard.

Built with Next.js (App Router), Supabase, Tailwind, and shadcn/ui.

## Routes

**Kiosk** (student facing)

| Route | What it does |
| --- | --- |
| `/kiosk` | Pick a form from a combobox, grouped by equipment category |
| `/kiosk/forms/[id]` | Checkout form. Mark each accessory Present or Not Present, enter name, NetID, due date and time, and the staff member's name. Submitting inserts a row into `submissions` with status `Checked Out` |

**Admin** (staff facing)

| Route | What it does |
| --- | --- |
| `/admin/submissions` | All submissions grouped by NetID in collapsible rows, searchable. Checked out rows have a button to start check-in |
| `/admin/submissions/[id]/check-in` | Confirm each accessory came back, note whether everything works, add a description and staff name. Submitting flips the row to `Checked In` |
| `/admin/forms` | List of forms with View, Edit, and Delete buttons, searchable by title |
| `/admin/forms/new` | Build a new form. Upload an image per accessory and give each one a label. Images go to the `equipment_images` bucket and the form row stores the paths |

## Project layout

```
app/                    routes for the kiosk and admin sides
components/             navbar, search bar, table row
components/ui/          shadcn/ui primitives
lib/supabase/           browser, server, and proxy clients
lib/mock_*.json         leftover sample data from before the tables existed
public/                 sample equipment images
proxy.ts                Next.js middleware, refreshes the Supabase session
```

Forms and submissions share the same shape for equipment: `equipment_labels` and `equipment_images` are parallel arrays, and the yes/no answers collected at checkout and check-in (`checkout_responses`, `checkin_responses`) line up with them by index.
