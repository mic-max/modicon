# ModIcon

An extension to customize favicons.

## How to check your wildcards
1. Visit [regex101](https://regex101.com)
2. Enter all the URLs in the test string text area
3. Copy the function wildcardToRegExp from util.js
4. Press F12 and open the console tab of the developer tools
5. Paste to the console and press enter
5. Call the function with the wildcard you have
6. Copy the output from the console and paste into the regular expression input
7. It should highlight all URLs you entered as individual matches

## Links
[E + D - Fall FHL 2019](https://garagehackbox.azurewebsites.net/hackathons/1916/projects/86419)

## Team Members
- Michael Maxwell
- Adaranijo Omooba

## To Do
- Not have to Ctrl+F5 to get the new icon
- Let user modify the pageUrl of an existing icon modification
- When making a new rule give option to use an icon already saved in storage

- Add a linter
- Add unit tests and integration tests?
- Autogenerate db.json as part of build pipeline
- Use Vue.js + TypeScript
- Use 32x32 icons ?
- When using an image url, have user specify whether to download that file
    - Or to always fetch the image from that URL on each load

- Let user download icon packs for certain sites
    - Need a service for these to be hosted on
    - Use json-server and github ? :o
    - Or let users add modifications by importing configs from a JSON file?
- Allow users to import/export their modifications for easy sharing
    - Include any icon packs in a /packs/ directory ?
    - Important for Edge users because extension sync isn't added yet
- Let user change priority of certain modifications (order in popup table)
    - Draggable table rows
    - Add an up and down arrow next to each rule
    - The chosen implementation will decide how the modifications are stored in sorted order
        - Add priority field on each modification, and swap those
        - When creating a modification, set the priority to modifications.length

- For pages where the default no icon is used
    - Replace with a random colour (possibly base random off url hostname? + path? so its deterministic)
    - Use this API https://api.adorable.io/avatars/64/abott@ddorable.png

- Pack extension and make available on Edge and Chrome
- Add support for Firefox

- Prefix 'data:image/png;base64,iVBORw0KGgo...' even more ???
- Add text files to icons directory for wildcards and info about the icon pack ???
    - Entire db.json is generated only from files inside the icons directory (no db_init.json)
    - Move db_init.json info into files in related directory
- Investigate why chrome.storage isn't saving RegExp properly
    - Submit a bug ?

## Extension Storage Format

{
    random_guid1: {
        priority: 1,
        img: '~1000 char string'
        wildcards: [
            '*hello*.com'
        ]
    }
}
