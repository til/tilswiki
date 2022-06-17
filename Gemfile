source 'http://rubygems.org'

gem 'rails', '3.0.20'

gem 'haml', '3.0.22'

gem 'andand'

gem 'rmagick', :require => 'RMagick'

gem 'dm-rails',             '~> 1.0.3'

DM_VERSION = '~> 1.0.0'
gem 'dm-sqlite-adapter',    DM_VERSION
gem 'dm-migrations',        DM_VERSION
gem 'dm-types',             DM_VERSION
gem 'dm-validations',       DM_VERSION
gem 'dm-constraints',       DM_VERSION
gem 'dm-transactions',      DM_VERSION
gem 'dm-aggregates',        DM_VERSION
gem 'dm-timestamps',        DM_VERSION
gem 'dm-observer',          DM_VERSION


# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'


# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug'

# Bundle the extra gems:
# gem 'bj'
gem 'nokogiri'
# gem 'sqlite3-ruby', :require => 'sqlite3'
# gem 'aws-s3', :require => 'aws/s3'

# Bundle gems for the local environment. Make sure to
# put test-only gems in this group so their generators
# and rake tasks are available in development mode:
# group :development, :test do
#   gem 'webrat'
# end


group :development do
  gem 'awesome_print'
  gem 'wirble'
end

group :development, :test do
  gem "rspec-rails", ">= 2.0.1"
  
  gem 'capybara'
  gem 'database_cleaner'
  gem 'cucumber-rails'
  gem 'cucumber'
  gem 'launchy'    # So you can do Then show me the page
end
