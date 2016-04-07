##AdFrame
An easy to use iFrame ad boilerplate that uses browser messaging to resize based on
contents size. Easy integration with google analytics. Multiple frames are allowed.

###To test:
Set up to test with pythons simple http server by running "python -m SimpleHTTPServer" and navigating to "http://0.0.0.0:8000".

###To setup for your ad:
Change the "src" and "scriptSrc" variables in the adFrame.js file to the urls they will load from on your site.

###To include on clients page:

Either include the script where you want it to display or add a "data-append" property onto the script with the css selector of the element to append the frame to (ex. data-append:"#thisDiv")
Allows for fixed width using the "data-width" property.
