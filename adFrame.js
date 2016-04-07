/*
** adFrame.js
** ad iframe generation
*/
(
	function (window, document)
	{

		function AdFrame()
		{

			/* Iframe DOM & style options
			-------------------------------*/
			var options = {
				append: "",
				height: "",
				minWidth: "300px",
				minHeight: "",
				maxWidth: "920px",
				uid: Math.floor(Math.random() * 20),
				width: "100%"
			};


			/* AdFrame Ad settings
			-----------------------------------------------------------*/

			// fix for IE missing origin
			if (!window.location.origin)
			{
			  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}

      // SRC: domain of the ad html ex http://example.com/
      var src = "http://0.0.0.0:8000";
      //scriptSrc: add domain from which the script is loaded from (ex http://example.com/adFrame.js)
      var scriptSrc = "http://0.0.0.0:8000/adFrame.js";


			var clientID = window.location.origin;
			var frameSrc = src + "/ad.html?ref=";
			var frameClass = "adFrame-ad-frame";
			var scriptID = "adFrame-ad-script";

			/* create a externally accessible iframe property for the AdFrame ad instance
			   to be used in generation.
			----------------------------------------------------------------------------*/
			this.iframes = [];


			/*	generateIFrame(userOptions)
				Genrates iframe with optional user generated options
				@param userOptions - User defined iframe options
			---------------------------------------------------------------------------------*/
			this.generateIFrame = function(userOptions)
			{
				//Check if user has defined options and override defaults
				options = _extendDefaults(options, userOptions);

				// If appendTo option defined, use as append to element, if not use the scripts placement
				var appendToEl = options.append ? document.querySelector(options.append) : document.getElementById("AdFrame-ad-script");

				//create iframe and add to AdFrame ad instance
				var iframe = document.createElement("iframe");

				// set iframe attributes, if custom height and width defined use. Defaults to 100%.
				iframe.id = "AdFrame-ad-frame" + options.uid;
				iframe.name = "AdFrame-ad-frame" + options.uid;
				iframe.src = frameSrc + clientID;
				iframe.className = frameClass;
				iframe.style.width = options.width;
				iframe.style.maxWidth = options.maxWidth;
				iframe.style.height = options.height;
				iframe.style.minWidth = options.minWidth;
				iframe.style.minHeight = options.minHeight;
				iframe.style.border = "none";

				iframe.setAttribute("allowfullscreen","true");

				// if appendToEl is the script, put element before it in DOM, else append to defined appendToEl
				if(appendToEl.tagName.toLowerCase() === "script")
				{
					appendToEl.parentNode.insertBefore( iframe, appendToEl);
				}
				else
				{
					appendToEl.appendChild(iframe);
				}

				this.iframes.push(iframe);
			};


			/*	init()
				Runs checks for externally loaded script, etc. and creates new i	Frame
			---------------------------------------------------------------------------------*/
			this.init = function()
			{
				_ifLoadedExternally.call(this);

				// Listens for message from a child frame to fire a resize event
				window.addEventListener("message", _resizeToNewContentHeight.bind(this), false);

			};


			/*---------------------------------------*/
			/*--- PRIVATE FUNCTIONS -----------------*/
			/*---------------------------------------*/


			/*	_extendDefaults(defaults, options)
				Change default options with user defined
				@param defaults - Default options
				@param properties - user defined options
			---------------------------------------------------------------------------------*/
			function _extendDefaults(defaults, options)
			{
				var property;

				for (property in options)
				{
				  if (options.hasOwnProperty(property))
				  {
					defaults[property] = options[property];
				  }
				}

				return defaults;
			}


			/*	_ifLoadedExternally()
				if script is loaded externally generate uid and set options with data-* attributes.
			---------------------------------------------------------------------------------------*/
			function _ifLoadedExternally()
			{
				if(!document.getElementById("AdFrame-inline-script"))
				{
					// get all scripts from document and create variable for the embed script if it is available
					var scripts = document.getElementsByTagName("script");
					var embedScript;
					var embedOptions = {};
					var uid = Math.floor(Math.random() * 20);

					// for each script, loop through and check for a the embed script by its source
					for(var i = 0; i < scripts.length; i++)
					{

						// if script has a source, the source matches the script were looking for, and the script has not had its uid added
						if(scripts[i].src && scripts[i].src.toLowerCase().indexOf(scriptSrc) && scripts[i].id.indexOf("AdFrame-ad-script") === -1)
						{
							// when the loop hits the embed script, set it and break loop
							embedScript = scripts[i];
							break;
						}
					}
					// if the embed script does not have the proper id, add it
					if(!embedScript.id || embedScript.id !== scriptID)
					{
						embedScript.setAttribute("id", scriptID + uid);
					}
					else
					{
						scriptID = embedScript.id + uid;
					}

					["height","width"].forEach(
						function(prop)
						{

							if(embedScript.getAttribute("data-" + prop))
							{
							   embedOptions[prop] = embedScript.getAttribute("data-" + prop);
							}
						}
					);

					embedOptions.append = embedScript.getAttribute("data-append") ? embedScript.getAttribute("data-append") : "#" + embedScript.id;
					embedOptions.uid = uid;

					// generate iframe with data-* attributes
					return this.generateIFrame(embedOptions);
				}
			}


			/*	_resizeToNewContentHeight()
				Recieves message posted from child frame with height specifications for
				resizing the iframe.
			---------------------------------------------------------------------------------*/
			function _resizeToNewContentHeight(event)
			{
				// verify the event originates from the iframes source
				if (event.origin === src)
				{
					var iFrame = document.getElementsByName(event.data.srcFrame)[0];

					// Size the events source frame element to the data;
					iFrame.style.height = event.data.height;
				}
			}


			return this;
		}

		if(!window.AdFrame)
		{
			window.AdFrame =  AdFrame();
		}

		window.AdFrame.init();
	}
)(window, document);
