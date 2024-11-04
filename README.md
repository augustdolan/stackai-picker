# Technical Choices

## Stack
- NextJS v14
- Shadcn
- tailwind
- AuthJS


## Reasoning
The majority of the stack was selected as they were listed in the Tech Stack section. However, there are two key differences: I did not use Tanstack Query and I did not manually resolve compatability for Shadcn with the latest stable of Next (v15). While I originally did use react query, AuthJS proved unsustainable with the `pages` router when using the `Credentials` provider. This provider is purposefully under-developed, and required additional piping to store the accessToken for. Also, this underdevelopment meant a wealth of type errors due to having to shim the user to get the information I needed. This caused build problems. Bouncing between the pages and app router meant more time spent on restructuring code unfortunately.

Besides tailwind, the stack was new for me (`app` router instead of `pages` router for Next was used). Shadcn proved mostly intuitive and easy. I did need to back away from using the `Form` with `react-hook-form` and the `Accordion` setup. They seemed to not play well together at all. In retrospect, I believe the main issue was I was nesting buttons (the accordion trigger is a button, and I tried to mimic the spec, which caused hydration issues due to the nested buttons). It was quite a bit of brain power put to the relationship of those two component families ultimately scrapped.

react query was avoided. Originally, I tried server side caching. Then I realized this was a nightmarish choice. It would require a lot of manual revalidation. On top of that, research provided that caching with Auth headers can cause data leaks - so let's not do that! Instead, I added the connection id to the path so I could utliize the client side cache. This was a much better choice. To make knowledge bases selectable, we will need to add knowledge bases onto the router before connections, since a knowledge base can only have one connection at a time. I avoided this for now since it wasn't the focus of the task.

Some of the APIs needed for this task needed to be obtained/interpreted from your site. For example, updating a knowledge base was a PUT requiring (seemingly) the same set of data as a POST. This was not detailed in your docs, but easy enough to investigate.

There seems to be a server error with your sync endpoint, though it doesn't exist on your site. Triggering the same URL from my domain causes a 500 error. We can debug this together if you want. I forced no caching to test caching errors, and I also tried various lengths of pause before calling sync to see if the problem had to do with a race condition - neither were the case. This server error means that although I add the resources to the knowledge base, there is no way to sync the knowledge base, and therefor the knowledge base fetch itself is stale and never updates to show what is actually indexed. Due to this, instead of finishing the functionality, I chose to update the structure with my limited time to be more extensible. On top of that, originally I did not actually add documents to a knowledge base, I always created new ones with the list (you have a lot of knowledge bases on that account now lol).

My updated structure included updates to the api calls. There is a bit of a dangling generalization for resource fetching, as the knowledge base resource fetch and google connection resource fetch were very similar. I didn't complete it since the queryParams were a bit different, and I wanted to focus my limited extra time elsewhere.

Caught a bug where empty directories would explode the app, so now we can handle empty directories. The accordion plays an obnoxious animation, but we could probably force a closed or opened state when it is empty, or otherwise not render the accordion at all.

Happier overall with code structure. The "Google Drive" entry remains a sore spot where I am filling the `Directory` component with side effects for a one off situation. I think I'd rather duplicate the structure for the one off than complicate the logic so much.




# Running the app
A simple `npm run dev` should do the trick!

# Development

## TODO
- [x] Add syncing of drive docs to knowledge base (kb indexing)
- [x] use Optimistic to update the UI for the user, and stack syncing with create
- [x] ensure caching is properly enabled. i.e., client side caching 
- [x] test new redirect from authjs callback
- [x] update auth types based on guide
- [ ] deindex for drive docs list
- [ ] add synced indicator for synced files
- [ ] ensure unsynced state is updated as well
- [ ] rotate tokens

### If time
- [ ] sort by date
- [ ] sort by name
- [ ] filter by name
- [ ] search by name
