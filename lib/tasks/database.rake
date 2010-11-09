namespace :db do
  namespace :test do
    task :prepare do
      DataMapper.auto_migrate!
    end
  end
end
