# Technical Choices

## Stack
- NextJS v14
- Shadcn
- tailwind
- AuthJS


## Reasoning
The majority of the stack was selected as they were listed in the Tech Stack section. However, there are two key differences: I did not use Tanstack Query and I did not manually resolve compatability for Shadcn with the latest stable of Next (v15). While I originally did use react query, AuthJS proved unsustainable with the `pages` router when using the `Credentials` provider. This provider is purposefully under-developed, and required additional piping to store the accessToken for. Also, this underdevelopment meant a wealth of type errors due to having to shim the user to get the information I needed. This caused build problems. Bouncing between the pages and app router meant more time spent on restructuring code unfortunately.

react query was avoided since Next extends `fetch` with caching on the server side, though I needed to turn on caching for calls with the `Authorization` header. There was no need for client side calls in this project. 

Besides tailwind, the stack was new for me (`app` router instead of `pages` router for Next was used). Shadcn proved intuitive and easy. Besides that, there were great learnings across the board. 

There's some stuff wrong with the app. The most egregious issue is that on `sync` the checkboxes do not uncheck. I ran out of time, though I will say my component structure makes it more complicated than it likely needs to be to remove those checks. Next step, I would probably try and optimistic state update from the server action that propogates through the component tree to uncheck the boxes. The optimistic state should revert once the server action finishes (from what I understand). The main component is a recursively calling component. I think it works fine, and the key takeaway for me was removing as much duplicated code as possible between the directory and file entries, while still letting directories behave as directories. 

Additionally, I am missing the knowledge base functionality. You can create knowledge bases, but even the feedback for creation is lacking. Next steps would've been interesting, though a bit unclear. For resources added to the knowledge base, I was planning on outlining in green and putting a small checkmark on the top right corner of the box. I would likely just add  "stored" next to the item before that though to make it quicker. It seems there was also a need to be able to sync / desync files/directories as well as remove them altogether from the sync screen. Shadcn makes menu buttons a breeze, so I would add a menu button for removing permanently from the view.


# Running the app
A simple `npm run dev` should do the trick!

# Development

## TODO
- [ ] deindex for drive docs list
- [ ] Add syncing of drive docs to knowledge base (kb indexing)
  - [ ] use Optimistic to update the UI for the user, and stack syncing with create
- [ ] add synced indicator for synced files
- [ ] ensure unsynced state is updated as well
- [ ] ensure caching is properly enabled. Caching should happen for ids, no?
- [ ] test new redirect from authjs callback
- [ ] update auth types based on guide
- [ ] rotate tokens

### If time
- [ ] sort by date
- [ ] sort by name
- [ ] filter by name
- [ ] search by name

## Notes
Some of the apis are missing from the spec, so I needed to go to the site to grab them from the network. One of them was confirming the correct `put` for syncing file sources

I went about caching wrong originally. I was concerned with caching the calls to the db, but by putting the ids onto the routes, I can now cache route calls, avoiding the issue with Authorization caching. The auth header caching was likely a data leak issue. Poor form there lol. Lets just use the client side cache for these since they are fully rendered server side. So, the updated routes with slug is to make use of the client router cache

A trickiness is the relationship between knowledge bases and connections, which I assume to be many to many...so...how do we cache with the client router? 

Knowledge base needs to be shimmed in front of connections I suppose?

Caught a bug where an empty directory would cause the app to explode since I was trying to convert a nonexistent property `directoryEntries` into an interable 

stop propogation on click makes it possible to toggle the dropdown and not hit the box, which is not great

context causes all children to rerender...might not be a great solution here
