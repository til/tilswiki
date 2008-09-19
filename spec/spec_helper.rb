require 'rubygems'
require 'merb-core'
require 'spec' # Satisfies Autotest and anyone else not using the Rake tasks

# Make sure the current working directory is the merb root. This is
# necessary when running single specs with 'spec' and current dir is a
# subdir. My emacs setup does that
if %w[models controllers helpers].include?(File.split(Dir.pwd).last)
  Dir.chdir("../..")
end

# this loads all plugins required in your init file so don't add them
# here again, Merb will do it for you
Merb.start_environment(:testing => true, :adapter => 'runner', :environment => ENV['MERB_ENV'] || 'test')

Spec::Runner.configure do |config|
  config.include(Merb::Test::ViewHelper)
  config.include(Merb::Test::RouteHelper)
  config.include(Merb::Test::ControllerHelper)
end
