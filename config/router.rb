# Merb::Router is the request routing mapper for the merb framework.
#
# You can route a specific URL to a controller / action pair:
#
#   match("/contact").
#     to(:controller => "info", :action => "contact")
#
# You can define placeholder parts of the url with the :symbol notation. These
# placeholders will be available in the params hash of your controllers. For example:
#
#   match("/books/:book_id/:action").
#     to(:controller => "books")
#   
# Or, use placeholders in the "to" results for more complicated routing, e.g.:
#
#   match("/admin/:module/:controller/:action/:id").
#     to(:controller => ":module/:controller")
#
# You can specify conditions on the placeholder by passing a hash as the second
# argument of "match"
#
#   match("/registration/:course_name", :course_name => /^[a-z]{3,5}-\d{5}$/).
#     to(:controller => "registration")
#
# You can also use regular expressions, deferred routes, and many other options.
# See merb/specs/merb/router.rb for a fairly complete usage sample.

Merb.logger.info("Compiling routes...")
Merb::Router.prepare do
  match('/', :method => 'get' ).to(:controller => 'Index', :action => 'index')
  match('/', :method => 'post').to(:controller => 'Pages', :action => 'create')
  match('/', :method => 'put').to(:controller => 'Pages', :action => 'relocate')

  match('/:handle', :method => 'get' ).to(:controller => 'Pages', :action => 'show')
  match('/:handle', :method => 'put' ).to(:controller => 'Pages', :action => 'update')
  match('/:handle', :method => 'post').to(:controller => 'Pages', :action => 'upload')

  match('/:handle/insert_link', :method => 'get' ).to(:controller => 'Pages', :action => 'insert_link')

  match('/:handle/subscription',  :method => 'get'  ).to(:controller => 'Subscriptions', :action => 'show')
  match('/:handle/subscription',  :method => 'post' ).to(:controller => 'Subscriptions', :action => 'create')
  match('/unsubscribe/:secret', :method => 'get'  ).to(:controller => 'Subscriptions', :action => 'unsubscribe')
end
