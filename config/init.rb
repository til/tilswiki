# Move this to application.rb if you want it to be reloadable in dev mode.
Merb::Router.prepare do |r|
  r.match('/').to(:controller => 'Index', :action =>'index')

  r.match('/:page', :method => 'get').to(:controller => 'Pages', :action => 'show')
  r.match('/:page', :method => 'put').to(:controller => 'Pages', :action => 'update')

  r.default_routes
end


Merb::Config.use { |c|
  c[:environment]         = 'production',
  c[:framework]           = {},
  c[:log_level]           = 'debug',
  c[:use_mutex]           = false,
  c[:session_store]       = 'cookie',
  c[:session_id_key]      = '_session_id',
  c[:session_secret_key]  = 'c2fd77250f843d4049152a8179368a791acca321',
  c[:exception_details]   = true,
  c[:reload_classes]      = true,
  c[:reload_time]         = 0.5
}

dependency 'merb_helpers'
