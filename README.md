# Technical Choices

## Stack
- NextJS v14
- Shadcn
- tailwind
- AuthJS


## Reasoning
The majority of the stack was selected as they were listed in the Tech Stack section. However, there are two key differences: I did not use Tanstack Query and I did not manually resolve compatability for Shadcn with the latest stable of Next (v15). While I originally did use react query, AuthJS proved unsustainable with the `pages` router when using the `Credentials` provider, and the app router had reasonably intuitive caching for server side calls without needing to explicitly dehydrate and rehydrate the component like react query required. the authjs credentials provider is purposefully under-developed, and required additional piping to store the accessToken for. Also, this underdevelopment meant type errors due to having to shim the user to get the information I needed. This caused build problems. Bouncing between the pages and app router meant more time spent on restructuring code unfortunately.

next caches by extending `fetch` with caching capabilities, though I needed to force caching for calls with the `Authorization` header. There was no need for client side calls in this project. 

Besides tailwind, the stack was new for me (`app` router instead of `pages` router for Next was used). Shadcn proved intuitive and easy. I will absolutely be using it in the future. Besides that, there were great learnings across the board. 

There's some stuff wrong with the app. The most egregious issue is that on `sync` the checkboxes do not uncheck. I ran out of time, though I will say my component structure makes it more complicated than it likely needs to be to remove those checks. Next step, I would probably try an optimistic state update from the server action that propogates through the component tree to uncheck the boxes. The optimistic state should revert once the server action finishes (from what I understand). I also should have used a form for the resource selection, both for accessibiltiy as well as giving me the ability to use useOptimistic with a server action. I did however make use of this new paradigm with my login form. 

The main resource component is recursive, mapping over directory children to render all resources. I think it works fine, and the key takeaway for me was removing as much duplicated code as possible between the directory and file entries, while still letting directories behave as directories. However, to provide the "Google Drive" one, I put one off logic into the already complex component.

Additionally, I am missing the knowledge base functionality. You can create knowledge bases, but even the feedback for creation is lacking. Next steps would've been interesting, though a bit unclear. For resources added to the knowledge base, I was planning on outlining in green and putting a small checkmark on the top right corner of the box. I would likely just add  "stored" next to the item before that though to make it quicker. It seems there was also a need to be able to sync / desync files/directories as well as remove them altogether from the sync screen. Shadcn makes menu buttons a breeze, so I would add a menu button for removing permanently from the view.


# Running the app
A simple `npm run dev` should do the trick!
