steal('steal/html', function(){

var queue = [],
	found = {},
	s = steal;
/**
 * @function steal.html.crawl
 * @parent steal.html
 * Loads an ajax driven page and generates the html for google to crawl.
 * 
 * This crawler indexes an entire Ajax site.  It
 * 
 *   1. Opens a page in a headless browser.
 *   2. Waits until its content is ready.
 *   3. Scrapes its contents.
 *   4. Writes the contents to a file.
 *   5. Adds any links in the page that start with #! to be indexed
 *   6. Changes <code>window.location.hash</code> to the next index-able page
 *   7. Goto #2 and repeats until all pages have been loaded
 * 
 * ## 2. Wait until content is ready.
 * 
 * By default, [steal.html] will just wait until all scripts have finished loading
 * before scraping the page's contents.  To delay this, use
 * [steal.html.delay] and [steal.html.ready].
 * 
 * ## 3. Write the contents to a file.
 *  
 * You can change where the contents of the file are writen to by changing
 * the second parameter passed to <code>crawl</code>.
 * 
 * @param {Object} url the starting page to crawl
 * @param {String|Object} opts the location to put the crawled content.
 */
steal.html.crawl = function(url, opts){
	if(typeof opts == 'string'){
		opts = {out: opts}
	}
	
	steal.File(opts.out).mkdirs();
	
	steal.html.load(url, function(html){
		// called every time the page is 'ready'
//		steal.html.onready(function(html){
			// write HTML to file
			var hash = this.evaluate(function(){
				return window.location.hash.substr(1);
			})
			print("  > "+ opts.out+"/"+hash+".html")
			// write out the page
			steal.File(opts.out+"/"+hash+".html").save(html);
			var next = steal.html.crawl.addLinks(this);
			

			if(next){
				
				print("  "+next)
				this.evaluate(function(){
					steal.html.wait();
				})
				
				// get the next link
				this.evaluate(function(nextHash){
					window.location.hash = "Foo"
				}, next);
				// always wait 20ms
				java.lang.Thread.currentThread().sleep(30); 
				this.evaluate(function(){
					steal.html.ready();
				});
			}
			else {
				this.close()
			}
	})
}

steal.extend(steal.html.crawl, {
	getLinks : function(browser){
		var urls = browser.evaluate(function(){
			var getHash = function(href){
				var index = href.indexOf("#!");
				if(index > -1){
					return href.substr(index);
				}
			};
			var links = document.getElementsByTagName('a'),
				urls = [],
				hash;
			for(var i=0; i < links.length; i++){
				hash = getHash(links[i].href);
				if( hash ){
					urls.push( hash );
				}
			}
			return urls;
		});
		return urls;
	},
	addLinks : function(browser){
		var links = this.getLinks(browser),
			link;
		// add links that haven't already been added
		for(var i=0; i < links.length; i++){
			link = links[i];
			if(! found[link] ) {
				found[link] = true;
				queue.push( link );
			}
		}
		return queue.shift();
	}
})
// load a page, get its content, 
// find all #! links

// recurse

	
})
