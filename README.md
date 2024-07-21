# PixelPlayground
## Intro
This was a small scale project that I had put together for an interview.
The intention was to show how I would use TypeScript and the imported PixiJS and GSAP module in a project.
While it may not look the prettiest, I was told to focus less on the graphics and more on the coding.
With that, I focused on the usual OOP and static incorporation that TypeScript brings for JavaScript.

## Required Modules
GSAP(v3.12.5), PixiPlugin as part of GSAP, and PixiJS(v5.3.8)

## Intended Product
Initially I had used JSBin with a CDN link given by the interviewer for both GSAP(v3.12.5) and PixiJS(v5.3.8). JSBin was also the expected delivery method to send my code over for inspection, hence the initial use of it. The modules were brought into the page via the HTML tab under a `<script></script>` class, but I had found JSBin cumbersome in that it wasnt a full IDE/Code editor.

Due to the nature of JSBin, I used NPM to install the respective versions of GSAP and PixiJS locally and produced the project in Visual Studio Code.
This did result in a few issues when bringing the code over to JSBin, but this was resolved with removing the import statements as they didnt need importing with the CDN links.

The end result of this, and what it currently does, is that a container is generated with a random amount of balls inside.
These balls must interact with the screen/container itself, but inter-ball physics was plainly made to be optional in the introduction document, hence why the code behind that isn't neccessarily the best.

There were requirements of using both imports (the plugin for interoptability was added by myself for ease of use) to make buttons that would add, remove, and pause the balls. This was with a final addition of making the objects appear/dissapear in "interesting" ways.

## Intended Demonstration
I have not used TypeScript before, however this is what the position required, and I was interested to see if I could build something of a job quality in the week given. While there are areas I feel could do with some better care and attention, I do feel I have achieved my goal of demonstrating the ability to convert to a new tech stack if needed.

This was obviously aided in that I have OOP projects on the account and have used Statics & functional coding beforehand; but the introduction of asyncs, general TypeScript syntax, and JS website callbacks was new.