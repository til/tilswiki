# Merb::Router is the request routing mapper for the merb framework.
#
# You can route a specific URL to a controller / action pair:
#
#   r.match("/contact").
#     to(:controller => "info", :action => "contact")
#
# You can define placeholder parts of the url with the :symbol notation. These
# placeholders will be available in the params hash of your controllers. For example:
#
#   r.match("/books/:book_id/:action").
#     to(:controller => "books")
#   
# Or, use placeholders in the "to" results for more complicated routing, e.g.:
#
#   r.match("/admin/:module/:controller/:action/:id").
#     to(:controller => ":module/:controller")
#
# You can also use regular expressions, deferred routes, and many other options.
# See merb/specs/merb/router.rb for a fairly complete usage sample.

Merb.logger.info("Compiling routes...")
Merb::Router.prepare do |r|
  # Change this for your home page to be available at /
  # r.match('/').to(:controller => 'whatever', :action =>'index')

  r.match('/', :method => 'get' ).to(:controller => 'Index', :action => 'index')
  r.match('/', :method => 'post').to(:controller => 'Pages', :action => 'create')

  r.match('/:page', :method => 'get' ).to(:controller => 'Pages', :action => 'show')
  r.match('/:page', :method => 'put' ).to(:controller => 'Pages', :action => 'update')
  r.match('/:page', :method => 'post').to(:controller => 'Pages', :action => 'upload')

  r.match(%r{/([^/]+)/([^/]*)$}, :method => 'get' ).
    to(:controller => 'Assets', :action => 'show', :page => "[1]", :asset => "[2]")

  r.default_routes
end
